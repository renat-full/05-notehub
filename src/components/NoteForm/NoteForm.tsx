import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNotePayload } from '../../services/noteService';
import type { NoteTag, Note } from '../../types/note';
import css from './NoteForm.module.css';

const AVAILABLE_TAGS: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const initialValues: CreateNotePayload = {
  title: '',
  content: '',
  tag: AVAILABLE_TAGS[0],
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Мінімальна довжина 3 символи')
    .max(50, 'Максимальна довжина 50 символів')
    .required("Заголовок є обов'язковим полем"),
  content: Yup.string().max(500, 'Максимальна довжина 500 символів'),
  tag: Yup.string()
    .oneOf(AVAILABLE_TAGS, 'Недійсний тег')
    .required("Тег є обов'язковим полем"),
});

interface NoteFormProps {
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.setQueryData<Note[]>(['notes'], (oldNotes) => {
        queryClient.invalidateQueries({ queryKey: ['notes'] });
        return oldNotes;
      });

      onCancel();
    },
    onError: (error) => {
      console.error('Помилка при створенні нотатки:', error);
      alert('Помилка при створенні нотатки. Спробуйте пізніше.');
    },
  });

  const handleSubmit = (
    values: CreateNotePayload,
    { setSubmitting }: FormikHelpers<CreateNotePayload>
  ) => {
    createNoteMutation.mutate(values);
    setSubmitting(false);
  };

  const isSubmitting = createNoteMutation.isPending;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title">
              {(msg) => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content">
              {(msg) => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>
          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {AVAILABLE_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag">
              {(msg) => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || !isValid || !dirty}
            >
              {isSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
