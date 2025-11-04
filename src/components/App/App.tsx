import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import {
  fetchNotes,
  type NotesCollectionResponse,
} from '../../services/noteService';

import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css';

const INITIAL_PAGE = 1;

function App() {
  const [page, setPage] = useState(INITIAL_PAGE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error } = useQuery<NotesCollectionResponse>(
    {
      queryKey: ['notes', page, debouncedSearch],
      queryFn: () => fetchNotes({ page, search: debouncedSearch }),
      retry: 1,

      placeholderData: (previousData) => previousData,
    }
  );

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  const handlePageChange = useCallback((selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(INITIAL_PAGE);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchQuery} onChange={handleSearchChange} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              forcePage={page - 1}
            />
          )}
          <button
            className={css.button}
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            Create note +
          </button>
        </header>
        {isLoading && (
          <p className={css.statusMessage}>Завантаження нотаток...</p>
        )}
        {isError && (
          <p className={css.errorMessage}>
            Помилка завантаження:{' '}
            {error instanceof Error ? error.message : 'Невідома помилка'}
          </p>
        )}
        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} />
        )}
        {!isLoading && !isError && notes.length === 0 && (
          <p className={css.statusMessage}>Не знайдено жодної нотатки.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </>
  );
}

export default App;
