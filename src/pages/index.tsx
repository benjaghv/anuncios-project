import { Modal, Container, Title, Button, SimpleGrid, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import { AnuncioCard } from '~/components/AnuncioCard';
import { api } from "~/utils/api";
import { useState } from 'react';
import { AnuncioForm } from '~/components/AnuncioForm';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';



interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  estado: boolean;
}

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [opened, setOpened] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);



  const DATA = api.anuncios.getAll.useQuery(
    undefined,
    {
      // staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      gcTime: 0,
    }
  ); 

  const { data: anuncioToEdit } = api.anuncios.getById.useQuery(
    { id: editId!, email: session?.user?.email ?? "_" },
    { enabled: !!editId,
      staleTime: 20000,
     }
  );





  const createAnuncio = api.anuncios.create.useMutation({
    onSuccess: () => {
      void DATA.refetch();
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

  const updateAnuncio = api.anuncios.update.useMutation({
    onSuccess: async () => {
      await DATA.refetch();
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



  const deleteAnuncio = api.anuncios.delete.useMutation({
    onSuccess: () => {
      void DATA.refetch();
    },
  });

  useEffect(() => {
    console.log('=== ESTADO DE SESIÓN ===');
    console.log('Sesión:', session);
  }, [session]);



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


  return (
    <>
      <Modal
        opened={opened

        }
        onClose={() => setOpened(false)}
        title="Crear nuevo anuncio"
        size="lg"
      >
        <AnuncioForm
          onSubmit={async (values) => {
            if (!session) {
              notifications.show({
                title: 'No autenticado',
                message: 'Debes iniciar sesión para crear un anuncio.',
                color: 'red',
              });
              return;
            }

            await createAnuncio.mutateAsync(values);
            await DATA.refetch();
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

      <Container size="xl" py="xl">

        <Group justify="space-between" mb="xl">
          <Title order={1}>Anuncios</Title>

          {!session ? (
            <Group>
              <Button variant="outline" onClick={() => signIn('cognito')}>
                Iniciar sesión
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
                  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
                  const redirectUri = `${window.location.origin}/api/auth/callback/cognito`;
                  const signupUrl = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;
                  window.location.href = signupUrl;
                }}
              >
                Registrarse
              </Button>
            </Group>
          ) : (
            <Group>
              <Button variant="default" onClick={() => signOut()}>
                Cerrar sesión
              </Button>
              <Button onClick={() => setOpened(true)}>Crear nuevo anuncio</Button>
            </Group>
          )}

        </Group>

       


        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {DATA.data?.map((anuncio: Anuncio) => (
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
    </>
  );
}
