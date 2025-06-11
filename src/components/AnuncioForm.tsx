import {
    TextInput,
    Textarea,
    Switch,
    Button,
    Stack,
  } from '@mantine/core';
  import { useForm } from '@mantine/form';
  import { api } from '~/utils/api';
  
  interface AnuncioFormProps {
    onSubmit?: () => void;
    initialValues?: {
      titulo: string;
      descripcion: string;
      estado: boolean;
    };
    isEditing?: boolean;
  }
  
  export function AnuncioForm({
    initialValues,
    onSubmit,
    isEditing = false,
  }: AnuncioFormProps) {
    const form = useForm({
      initialValues: initialValues || {
        titulo: '',
        descripcion: '',
        estado: true,
      },
      validate: {
        titulo: (value) =>
          value.length < 3 ? 'El título debe tener al menos 3 caracteres' : null,
        descripcion: (value) =>
          value.length < 10
            ? 'La descripción debe tener al menos 10 caracteres'
            : null,
      },
    });
  
    const utils = api.useUtils();
  
    const createAnuncio = api.anuncios.create.useMutation({
      onSuccess: () => {
        void utils.anuncios.getAll.invalidate();
        onSubmit?.();
      },
    });
  
    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <Stack>
            <TextInput
              label="Título"
              {...form.getInputProps('titulo')}
            />
    
            <Textarea
              label="Descripción"
              minRows={4}
              {...form.getInputProps('descripcion')}
            />
    
            <Switch
              label="Anuncio activo"
              {...form.getInputProps('estado', { type: 'checkbox' })}
            />
    
            <Button type="submit">
              {isEditing ? 'Actualizar anuncio' : 'Crear anuncio'}
            </Button>
          </Stack>
        </form>
      );
    }
  