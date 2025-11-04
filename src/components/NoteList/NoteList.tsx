import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending,
        variables,
    } = useMutation<Note, Error, string>({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            console.error('Помилка при видаленні нотатки:', error);
            alert('Помилка: не вдалося видалити нотатку.');
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
            mutate(id);
        }
    };

    if (notes.length === 0) {
        return <p className={css.noNotes}>У вас поки що немає нотаток.</p>;
    }

    return (
        <ul className={css.list}>
            {notes.map((note) => {
                const isDeleting =
                    isPending &&
                    variables === note.id;

                return (
                    <li key={note.id} className={css.listItem}>
                        <h2 className={css.title}>{note.title}</h2>
                        <p className={css.content}>{note.content}</p>
                        <div className={css.footer}>
                            <span className={css.tag}>{note.tag}</span>

                            <button
                                className={css.button}
                                type="button"
                                onClick={() => handleDelete(note.id)}
                                disabled={isPending}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default NoteList;