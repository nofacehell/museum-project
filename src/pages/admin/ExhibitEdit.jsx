// 💅 Стилизованная форма создания/редактирования экспоната с адаптивной вёрсткой
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
  HStack,
  IconButton,
  Text,
  Image,
  Grid,
  GridItem,
  Select,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  getExhibitById,
  createExhibit,
  updateExhibit,
  getCategories
} from '../../utils/api';
import { getStaticUrl } from '../../utils/config';
import 'uikit/dist/css/uikit.min.css';

const ExhibitEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isNew = !id || id === 'new';

  const [exhibit, setExhibit] = useState({
    title: '',
    categoryId: '',
    description: '',
    shortDescription: '',
    year: '',
    manufacturer: '',
    historicalContext: '',
    technicalSpecs: {},
    additionalImages: [],
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [loadingCats, setLoadingCats] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [technicalSpecKey, setTechnicalSpecKey] = useState('');
  const [technicalSpecValue, setTechnicalSpecValue] = useState('');
  const [interestingFact, setInterestingFact] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setLoadingCats(false);
      } catch (err) {
        console.error('Error loading categories:', err);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить категории',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadCategories();
  }, [toast]);

  useEffect(() => {
    if (!isNew) {
      const loadExhibit = async () => {
        try {
          const data = await getExhibitById(id);
          console.log('Exhibit from API:', data);
          let additionalImages = [];
          if (typeof data.additionalImages === 'string') {
            try {
              additionalImages = JSON.parse(data.additionalImages);
            } catch (e) {
              additionalImages = [];
            }
          } else if (Array.isArray(data.additionalImages)) {
            additionalImages = data.additionalImages;
          } else {
            additionalImages = [];
          }
          let technicalSpecs = {};
          if (typeof data.technicalSpecs === 'string') {
            try {
              technicalSpecs = JSON.parse(data.technicalSpecs);
            } catch (e) {
              technicalSpecs = {};
            }
          } else if (typeof data.technicalSpecs === 'object' && data.technicalSpecs !== null) {
            technicalSpecs = data.technicalSpecs;
          } else {
            technicalSpecs = {};
          }
          setExhibit({
            ...data,
            additionalImages,
            technicalSpecs,
          });
          setLoading(false);
        } catch (err) {
          console.error('Error loading exhibit:', err);
          toast({
            title: 'Ошибка',
            description: 'Не удалось загрузить экспонат',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

      loadExhibit();
    }
  }, [id, isNew, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExhibit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setExhibit(prev => ({ ...prev, image: URL.createObjectURL(f) }));
  };

  const handleAdditionalFiles = e => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setAdditionalFiles(prev => [...prev, ...files]);
    const newImages = files.map(file => URL.createObjectURL(file));
    setExhibit(prev => ({
      ...prev,
      additionalImages: [...(prev.additionalImages || []), ...newImages]
    }));
  };

  const handleRemoveAdditionalImage = index => {
    setExhibit(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleTechnicalSpecChange = (index, field, value) => {
    const specs = { ...exhibit.technicalSpecs };
    const entries = Object.entries(specs);
    const newEntries = entries.map((entry, i) => {
      if (i === index) {
        return field === 'key' ? [value, entry[1]] : [entry[0], value];
      }
      return entry;
    });
    setExhibit(prev => ({
      ...prev,
      technicalSpecs: Object.fromEntries(newEntries)
    }));
  };

  const handleAddTechnicalSpec = () => {
    if (technicalSpecKey && technicalSpecValue) {
      setExhibit(prev => ({
        ...prev,
        technicalSpecs: {
          ...prev.technicalSpecs,
          [technicalSpecKey]: technicalSpecValue,
        },
      }));
      setTechnicalSpecKey('');
      setTechnicalSpecValue('');
    }
  };

  const handleRemoveTechnicalSpec = key => {
    setExhibit(prev => {
      const newSpecs = { ...prev.technicalSpecs };
      delete newSpecs[key];
      return {
        ...prev,
        technicalSpecs: newSpecs,
      };
    });
  };

  const handleAddInterestingFact = () => {
    if (interestingFact) {
      setExhibit(prev => ({
        ...prev,
        interestingFacts: [...prev.interestingFacts, interestingFact],
      }));
      setInterestingFact('');
    }
  };

  const handleRemoveInterestingFact = index => {
    setExhibit(prev => ({
      ...prev,
      interestingFacts: prev.interestingFacts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const exhibitToSend = {
        ...exhibit,
        technicalSpecs: JSON.stringify(exhibit.technicalSpecs),
      };
      if (isNew) {
        await createExhibit(exhibitToSend);
        toast({
          title: 'Успех',
          description: 'Экспонат успешно создан',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await updateExhibit(id, exhibitToSend);
        toast({
          title: 'Успех',
          description: 'Экспонат успешно обновлен',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      navigate('/admin/exhibits');
    } catch (err) {
      console.error('Error saving exhibit:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить экспонат',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading || loadingCats) {
    return <Box p={4}>Загрузка...</Box>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl">{isNew ? 'Создание экспоната' : 'Редактирование экспоната'}</Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel>Название</FormLabel>
              <Input
                name="title"
                value={exhibit.title}
                onChange={handleInputChange}
                placeholder="Введите название экспоната"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Категория</FormLabel>
              <Select
                name="categoryId"
                value={exhibit.categoryId}
                onChange={handleInputChange}
                placeholder="Выберите категорию"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Описание</FormLabel>
              <Textarea
                name="description"
                value={exhibit.description}
                onChange={handleInputChange}
                placeholder="Введите описание экспоната"
                rows={4}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Краткое описание</FormLabel>
              <Textarea
                name="shortDescription"
                value={exhibit.shortDescription}
                onChange={handleInputChange}
                placeholder="Введите краткое описание"
                rows={2}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Год</FormLabel>
              <Input
                name="year"
                value={exhibit.year}
                onChange={handleInputChange}
                placeholder="Введите год"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Производитель</FormLabel>
              <Input
                name="manufacturer"
                value={exhibit.manufacturer}
                onChange={handleInputChange}
                placeholder="Введите производителя"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Исторический контекст</FormLabel>
              <Textarea
                name="historicalContext"
                value={exhibit.historicalContext}
                onChange={handleInputChange}
                placeholder="Введите исторический контекст"
                rows={4}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Основное изображение</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFile}
              />
              {exhibit.image && (
                <Box mt={2}>
                  <Image
                    src={
                      exhibit.image.startsWith('blob:') || exhibit.image.startsWith('http')
                        ? exhibit.image
                        : getStaticUrl(exhibit.image)
                    }
                    alt="Preview"
                    maxH="200px"
                    objectFit="contain"
                  />
                </Box>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Дополнительные изображения</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalFiles}
              />
              {exhibit.additionalImages.length > 0 && (
                <Grid templateColumns="repeat(3, 1fr)" gap={2} mt={2}>
                  {exhibit.additionalImages.map((image, index) => (
                    <Box key={index} position="relative">
                      <Image
                        src={
                          image.startsWith('blob:') || image.startsWith('http')
                            ? image
                            : getStaticUrl(image)
                        }
                        alt={`Preview ${index + 1}`}
                        maxH="100px"
                        objectFit="cover"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        position="absolute"
                        top={1}
                        right={1}
                        onClick={() => handleRemoveAdditionalImage(index)}
                      />
                    </Box>
                  ))}
                </Grid>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Технические характеристики</FormLabel>
              <HStack>
                <Input
                  placeholder="Название"
                  value={technicalSpecKey}
                  onChange={(e) => setTechnicalSpecKey(e.target.value)}
                />
                <Input
                  placeholder="Значение"
                  value={technicalSpecValue}
                  onChange={(e) => setTechnicalSpecValue(e.target.value)}
                />
                <IconButton
                  icon={<AddIcon />}
                  onClick={handleAddTechnicalSpec}
                  colorScheme="blue"
                />
              </HStack>
              {Object.entries(exhibit.technicalSpecs).length > 0 && (
                <VStack align="stretch" mt={2}>
                  {Object.entries(exhibit.technicalSpecs).map(([key, value]) => (
                    <HStack key={key} justify="space-between">
                      <Text>
                        <strong>{key}:</strong> {value}
                      </Text>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleRemoveTechnicalSpec(key)}
                      />
                    </HStack>
                  ))}
                </VStack>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Интересные факты</FormLabel>
              <HStack>
                <Input
                  placeholder="Добавить интересный факт"
                  value={interestingFact}
                  onChange={(e) => setInterestingFact(e.target.value)}
                />
                <IconButton
                  icon={<AddIcon />}
                  onClick={handleAddInterestingFact}
                  colorScheme="blue"
                />
              </HStack>
              {exhibit.interestingFacts.length > 0 && (
                <VStack align="stretch" mt={2}>
                  {exhibit.interestingFacts.map((fact, index) => (
                    <HStack key={index} justify="space-between">
                      <Text>{fact}</Text>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleRemoveInterestingFact(index)}
                      />
                    </HStack>
                  ))}
                </VStack>
              )}
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg">
              {isNew ? 'Создать' : 'Сохранить'}
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default ExhibitEdit;