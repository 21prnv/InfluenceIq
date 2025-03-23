import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch categories from the database
    const { data: categories, error: fetchError } = await supabase
      .from('categories')
      .select('id, category')
      .order('id');
    
    if (fetchError) {
      console.error('Error fetching categories:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch categories', 
        details: fetchError 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      message: categories && categories.length > 0 
        ? 'Categories fetched successfully' 
        : 'No categories found in database',
      data: categories || []
    });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error 
    }, { status: 500 });
  }
} 