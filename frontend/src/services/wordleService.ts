import axios from 'axios';
import type { GuessResponse, WordGuess, WordResponse } from '../types/word';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const wordleApi = {
    getWordResponse: async (): Promise<WordResponse> => {
        const response = await api.get<WordResponse>('/word');
        return response.data;
    },

    submitGuess: async (guessOrPayload: string | WordGuess): Promise<GuessResponse> => {
        const payload = typeof guessOrPayload === 'string'
            ? { guess: guessOrPayload }
            : guessOrPayload;

        const response = await api.post<GuessResponse>('/guess', payload);
        return response.data;
    },
};