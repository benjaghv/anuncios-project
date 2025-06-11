import { Container, Title, Button, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { AnuncioForm } from '~/components/AnuncioForm';
import { api } from '~/utils/api';

export default function NuevoAnuncio() {
  const router = useRouter();
  const createAnuncio = api.anuncios.create.useMutation({
    onSuccess: () => {
      void router.push('/');
    },
  });

  return (
    <Container size="sm" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Crear nuevo anuncio</Title>
        <Button variant="light" onClick={() => router.push('/')}>
          Volver
        </Button>
      </Group>
      <AnuncioForm
        onSubmit={(values) => {
          createAnuncio.mutate(values);
        }}
      />
    </Container>
  );
} 