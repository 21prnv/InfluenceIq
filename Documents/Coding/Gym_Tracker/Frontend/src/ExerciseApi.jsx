import axios from 'axios';

const API_URL = 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/back';
const API_KEY = '7137223635msh422bda4f8ec7448p11ab8ajsn896fe3bd19a8'; 

export const fetchExercises = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    });
    console.log('API response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};
