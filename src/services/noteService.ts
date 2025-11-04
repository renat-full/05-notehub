import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note'

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
    console.error('VITE_NOTEHUB_TOKEN is not set in environment variables!');
}

const noteHub = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    },
});

export interface FetchNotesParams {
    page?: number;
    perPage?: number;
    search?: string;
}

export interface CreateNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}

export interface NotesCollectionResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (
    params: FetchNotesParams = {},
): Promise<NotesCollectionResponse> => {
    const finalParams: FetchNotesParams = { perPage: 12, ...params };

    const urlParams = new URLSearchParams({
        ...(finalParams.page && { page: finalParams.page.toString() }),
        ...(finalParams.perPage && { perPage: finalParams.perPage.toString() }),
        ...(finalParams.search && { search: finalParams.search }),
    }).toString();

    const url = `/notes${urlParams ? '?' + urlParams : ''}`;

    const response: AxiosResponse<NotesCollectionResponse> = await noteHub.get(url);

    return response.data;
};

export const createNote = async (newNoteData: CreateNotePayload): Promise<Note> => {
    const response: AxiosResponse<Note> = await noteHub.post('/notes', newNoteData);

    return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const response: AxiosResponse<Note> = await noteHub.delete(`/notes/${id}`);

    return response.data;
};