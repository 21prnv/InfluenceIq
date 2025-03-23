"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supbase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function DebugPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTableData, setUserTableData] = useState<any[]>([]);
  const [categoryTableData, setCategoryTableData] = useState<any[]>([]);
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  
  const supabase = createClient();
  
  // First, fetch available tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        
        // This uses Postgres introspection to list tables
        const { data, error } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');
        
        if (error) {
          console.error('Error fetching tables:', error);
          setError(`Failed to fetch tables: ${error.message}`);
        } else {
          setTables(data || []);
        }
      } catch (err: any) {
        setError(`Error listing tables: ${err.message}`);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTables();
  }, []);
  
  // Function to fetch specific table data
  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true);
      setActiveTable(tableName);
      setError(null);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10);
      
      if (error) {
        setError(`Error fetching data from ${tableName}: ${error.message}`);
      } else {
        if (tableName === 'user_data') {
          setUserTableData(data || []);
        } else if (tableName === 'categories') {
          setCategoryTableData(data || []);
        }
      }
    } catch (err: any) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError('Please enter a category name');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('categories')
        .insert({ category: newCategory.trim() });
      
      if (error) {
        setError(`Failed to add category: ${error.message}`);
      } else {
        setNewCategory('');
        // Refresh categories
        fetchTableData('categories');
      }
    } catch (err: any) {
      setError(`Error adding category: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a category
  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        setError(`Failed to delete category: ${error.message}`);
      } else {
        // Refresh categories
        fetchTableData('categories');
      }
    } catch (err: any) {
      setError(`Error deleting category: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Debug Page</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Supabase Tables</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p>Loading tables...</p>}
              
              <div className="flex flex-col gap-2">
                {tables.map((table) => (
                  <Button
                    key={table.tablename}
                    variant={activeTable === table.tablename ? "default" : "outline"}
                    onClick={() => fetchTableData(table.tablename)}
                    className="justify-start"
                  >
                    {table.tablename}
                  </Button>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Add Category</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addCategory} variant="default">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTable ? `Table: ${activeTable}` : 'Select a table'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading data...</p>
              ) : activeTable === 'categories' ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryTableData.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-center">
                            No data found
                          </td>
                        </tr>
                      ) : (
                        categoryTableData.map((row) => (
                          <tr key={row.id} className="border-b border-zinc-800">
                            <td className="px-4 py-2">{row.id}</td>
                            <td className="px-4 py-2">{row.category}</td>
                            <td className="px-4 py-2 text-right">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deleteCategory(row.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : activeTable === 'user_data' ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Instagram Username</th>
                        <th className="px-4 py-2 text-left">Has Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTableData.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-center">
                            No data found
                          </td>
                        </tr>
                      ) : (
                        userTableData.map((row) => (
                          <tr key={row.id} className="border-b border-zinc-800">
                            <td className="px-4 py-2">{row.id}</td>
                            <td className="px-4 py-2">{row.insta_username}</td>
                            <td className="px-4 py-2">
                              {row.reponse ? '✅' : '❌'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-zinc-400">Select a table to view its data</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 