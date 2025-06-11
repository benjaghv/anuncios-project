import { Card, Text, Group, Badge, Button } from '@mantine/core';
import { useRouter } from 'next/router';

interface AnuncioCardProps {
  id: string;
  titulo: string;
  descripcion: string;
  estado: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function AnuncioCard({ id, titulo, descripcion, estado, onDelete, onEdit }: AnuncioCardProps) {
  const router = useRouter();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="lg">
          {titulo}
        </Text>
        <Badge color={estado ? "green" : "red"}>
          {estado ? "Activo" : "Inactivo"}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        {descripcion}
      </Text>


      <Group>
        <Button 
          variant="light" 
          color="blue" 
          onClick={() => onEdit?.(id)}
        >
          Editar
        </Button>
        <Button 
          variant="light" 
          color="red" 
          onClick={() => onDelete?.(id)}
        >
          Eliminar
        </Button>
      </Group>
    </Card>
  );
} 
