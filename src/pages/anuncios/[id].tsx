import { Container, Title, Button, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { AnuncioForm } from '~/components/AnuncioForm';
import { api } from '~/utils/api';
import { notifications } from '@mantine/notifications';

export default function EditarAnuncio() {
  const router = useRouter();
  const { id } = router.query;

  const utils = api.useUtils(); // 👈 para invalidar cache

  const { data: anuncio, isLoading } = api.anuncios.getById.useQuery(
    { id: id as string },
    { enabled: !!id }
  );

  const updateAnuncio = api.anuncios.update.useMutation({
    onSuccess: async () => {
      await utils.anuncios.getAll.invalidate(); 
      router.push('/'); 
    },
  });

  if (isLoading || !anuncio) {
    return <div>Cargando...</div>;
  }

  return (
    <Container size="sm" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Editar anuncio</Title>
        <Button variant="light" onClick={() => router.push('/')}>
          Volver
        </Button>
      </Group>

      <AnuncioForm
        initialValues={{
          titulo: anuncio.titulo,
          descripcion: anuncio.descripcion,
          estado: anuncio.estado,
        }}
        onSubmit={(values) => {
          updateAnuncio.mutate({
            id: anuncio.id,
            ...values,
          });
        }}
        isEditing
      />
    </Container>
  );
}
