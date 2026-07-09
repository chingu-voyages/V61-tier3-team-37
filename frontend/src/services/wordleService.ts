import axios from 'axios';
import type { WordGuessStatus, WordGuess } from '../types/word';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const wordleApi = {
    getWordResponse: async (): Promise<WordGuessStatus[]> => {
        const response = await api.get<WordGuessStatus[]>('/word');
        return response.data;
    },

    // Create new task
    submitGuess: async (wordGuess: WordGuess): Promise<WordGuessStatus> => {
        const response = await api.post<WordGuessStatus >('/guess', wordGuess);
        return response.data;
    },

};