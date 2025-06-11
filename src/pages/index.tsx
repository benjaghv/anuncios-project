import { Modal,Container, Title, Button, SimpleGrid, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { AnuncioCard } from '~/components/AnuncioCard';
import { api } from "~/utils/api";
import { useState } from 'react';
import { AnuncioForm } from '~/components/AnuncioForm';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';



interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  estado: boolean;
}

export default function Home() {
  const router = useRouter();
  const { data: anuncios, refetch } = api.anuncios.getAll.useQuery();
  const deleteAnuncio = api.anuncios.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: '¿Eliminar anuncio?',
      centered: true,
      children: (
        <p>
          ¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se puede deshacer.
        </p>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteAnuncio.mutate(
          { id },
          {
            onSuccess: () => {
              notifications.show({
                title: 'Anuncio eliminado',
                message: 'El anuncio fue eliminado correctamente.',
                color: 'green',
              });
            },
            onError: () => {
              notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el anuncio.',
                color: 'red',
              });
            },
           
          }
        );
      },
    });
  };
  

  const [opened, setOpened] = useState(false);

  const createAnuncio = api.anuncios.create.useMutation({
    onSuccess: () => {
      void refetch();
      notifications.show({
        title: 'Anuncio creado',
        message: 'Tu anuncio se publicó correctamente.',
        color: 'green',
      });
  
      void router.push('/');
    },
    onError: () => {
      notifications.show({
        title: 'Error al crear',
        message: 'Hubo un problema al crear el anuncio.',
        color: 'red',
      });
    },
  });


  const [editId, setEditId] = useState<string | null>(null);

  const { data: anuncioToEdit } = api.anuncios.getById.useQuery(
    { id: editId! },
    { enabled: !!editId }
  );
  
  const updateAnuncio = api.anuncios.update.useMutation({
    onSuccess: async () => {
      await refetch();
      setEditId(null); // Cierra modal

      notifications.show({
        title: 'Anuncio actualizado',
        message: 'El anuncio fue editado correctamente.',
        color: 'green',
      });
  
      router.push('/'); 
    },
    onError: () => {
      notifications.show({
        title: 'Error al actualizar',
        message: 'No se pudo actualizar el anuncio.',
        color: 'red',
      });
    },
  });

  
  

  return (
    <Container size="xl" py="xl">
      <Modal
  opened={opened

  }
  onClose={() => setOpened(false)}
  title="Crear nuevo anuncio"
  size="lg"
>
  <AnuncioForm
    onSubmit={async (values) => {
      await createAnuncio.mutateAsync(values);
      await refetch();
      setOpened(false);
    }}
  />
</Modal>
    <Modal
      opened={!!editId}
      onClose={() => setEditId(null)}
      title="Editar anuncio"
      size="lg"
    >
      {anuncioToEdit && (
        <AnuncioForm
          initialValues={{
            titulo: anuncioToEdit.titulo,
            descripcion: anuncioToEdit.descripcion,
            estado: anuncioToEdit.estado,
          }}
          onSubmit={(values) =>
            updateAnuncio.mutate({ id: anuncioToEdit.id, ...values })
          }
          isEditing
        />
      )}
    </Modal>

    <Group justify="space-between" mb="xl">
      <Title order={1}>Anuncios</Title>
      <Button onClick={() => setOpened(true)}>
        Crear nuevo anuncio
      </Button>
    </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {anuncios?.map((anuncio: Anuncio) => (
          <AnuncioCard
            key={anuncio.id}
            id={anuncio.id}
            titulo={anuncio.titulo}
            descripcion={anuncio.descripcion}
            estado={anuncio.estado}
            onDelete={handleDelete}
            onEdit={(id) => setEditId(id)}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
