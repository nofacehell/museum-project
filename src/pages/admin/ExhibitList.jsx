import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  IconButton,
  useToast,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { getExhibits, deleteExhibit, toggleFeatured } from '../../utils/api';

const ExhibitList = () => {
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchExhibits();
  }, []);

  const fetchExhibits = async () => {
    try {
      const data = await getExhibits();
      setExhibits(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список экспонатов',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот экспонат?')) {
      try {
        await deleteExhibit(id);
        setExhibits((prev) => prev.filter((exhibit) => exhibit.id !== id));
        toast({
          title: 'Экспонат удален',
          description: 'Экспонат успешно удален из базы данных',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить экспонат',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const updatedExhibit = await toggleFeatured(id);
      setExhibits((prev) =>
        prev.map((exhibit) =>
          exhibit.id === id ? { ...exhibit, featured: updatedExhibit.featured } : exhibit
        )
      );
      toast({
        title: 'Статус обновлен',
        description: `Экспонат ${updatedExhibit.featured ? 'добавлен в' : 'удален из'} избранного`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус экспоната',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Загрузка...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <HStack justify="space-between" align="center">
          <Heading>Список экспонатов</Heading>
          <Button
            as={RouterLink}
            to="/admin/exhibits/create"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            Добавить экспонат
          </Button>
        </HStack>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Изображение</Th>
              <Th>Название</Th>
              <Th>Описание</Th>
              <Th>Статус</Th>
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {exhibits.map((exhibit) => (
              <Tr key={exhibit.id}>
                <Td>
                  <Image
                    src={exhibit.mainImage}
                    alt={exhibit.title}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Td>
                <Td>{exhibit.title}</Td>
                <Td>
                  <Text noOfLines={2}>{exhibit.description}</Text>
                </Td>
                <Td>
                  <Badge colorScheme={exhibit.featured ? 'green' : 'gray'}>
                    {exhibit.featured ? 'Избранное' : 'Обычный'}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Редактировать"
                      as={RouterLink}
                      to={`/admin/exhibits/edit/${exhibit.id}`}
                      colorScheme="blue"
                      size="sm"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Удалить"
                      onClick={() => handleDelete(exhibit.id)}
                      colorScheme="red"
                      size="sm"
                    />
                    <IconButton
                      icon={<StarIcon />}
                      aria-label="Избранное"
                      onClick={() => handleToggleFeatured(exhibit.id)}
                      colorScheme={exhibit.featured ? 'yellow' : 'gray'}
                      size="sm"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default ExhibitList; 