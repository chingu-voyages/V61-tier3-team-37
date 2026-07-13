import axios from 'axios';
import type { WordGuess, GuessResponse, WordResponse } from '../types/word';

const API_BASE_URL = '/api';

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

    submitGuess: async (wordGuess: WordGuess): Promise<GuessResponse> => {
        const response = await api.post<GuessResponse>('/guess', wordGuess);
        return response.data;
    },
};
