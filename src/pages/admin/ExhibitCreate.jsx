import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { createExhibit } from '../../utils/api';

const ExhibitCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    historicalContext: '',
    technicalSpecs: [],
    interestingFacts: [],
    mainImage: null,
    additionalImages: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        mainImage: file,
      }));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      additionalImages: [...prev.additionalImages, ...files],
    }));
  };

  const handleRemoveAdditionalImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleTechnicalSpecChange = (index, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.technicalSpecs];
      newSpecs[index] = value;
      return {
        ...prev,
        technicalSpecs: newSpecs,
      };
    });
  };

  const handleAddTechnicalSpec = () => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecs: [...prev.technicalSpecs, ''],
    }));
  };

  const handleRemoveTechnicalSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpecs: prev.technicalSpecs.filter((_, i) => i !== index),
    }));
  };

  const handleInterestingFactChange = (index, value) => {
    setFormData((prev) => {
      const newFacts = [...prev.interestingFacts];
      newFacts[index] = value;
      return {
        ...prev,
        interestingFacts: newFacts,
      };
    });
  };

  const handleAddInterestingFact = () => {
    setFormData((prev) => ({
      ...prev,
      interestingFacts: [...prev.interestingFacts, ''],
    }));
  };

  const handleRemoveInterestingFact = (index) => {
    setFormData((prev) => ({
      ...prev,
      interestingFacts: prev.interestingFacts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('historicalContext', formData.historicalContext);
      formDataToSend.append('technicalSpecs', JSON.stringify(formData.technicalSpecs));
      formDataToSend.append('interestingFacts', JSON.stringify(formData.interestingFacts));

      if (formData.mainImage) {
        formDataToSend.append('mainImage', formData.mainImage);
      }

      formData.additionalImages.forEach((image) => {
        formDataToSend.append('additionalImages', image);
      });

      await createExhibit(formDataToSend);

      toast({
        title: 'Экспонат создан',
        description: 'Экспонат успешно добавлен в базу данных',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/admin/exhibits');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать экспонат',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Создание нового экспоната</Heading>

        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={8}>
            <GridItem colSpan={2}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Название</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Введите название экспоната"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Описание</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Введите описание экспоната"
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Исторический контекст</FormLabel>
                  <Textarea
                    name="historicalContext"
                    value={formData.historicalContext}
                    onChange={handleInputChange}
                    placeholder="Введите исторический контекст"
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Технические характеристики</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {formData.technicalSpecs.map((spec, index) => (
                      <HStack key={index}>
                        <Input
                          value={spec}
                          onChange={(e) => handleTechnicalSpecChange(index, e.target.value)}
                          placeholder="Введите техническую характеристику"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleRemoveTechnicalSpec(index)}
                          aria-label="Удалить характеристику"
                        />
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={handleAddTechnicalSpec}
                      variant="outline"
                    >
                      Добавить характеристику
                    </Button>
                  </VStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Интересные факты</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {formData.interestingFacts.map((fact, index) => (
                      <HStack key={index}>
                        <Input
                          value={fact}
                          onChange={(e) => handleInterestingFactChange(index, e.target.value)}
                          placeholder="Введите интересный факт"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleRemoveInterestingFact(index)}
                          aria-label="Удалить факт"
                        />
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={handleAddInterestingFact}
                      variant="outline"
                    >
                      Добавить факт
                    </Button>
                  </VStack>
                </FormControl>
              </VStack>
            </GridItem>

            <GridItem colSpan={2}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Основное изображение</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  {formData.mainImage && (
                    <Box mt={2}>
                      <Image
                        src={URL.createObjectURL(formData.mainImage)}
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
                    onChange={handleAdditionalImagesChange}
                  />
                  {formData.additionalImages.length > 0 && (
                    <Box mt={2}>
                      <Text mb={2}>Предпросмотр:</Text>
                      <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
                        {formData.additionalImages.map((image, index) => (
                          <Box key={index} position="relative">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              maxH="150px"
                              objectFit="contain"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              position="absolute"
                              top={2}
                              right={2}
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleRemoveAdditionalImage(index)}
                              aria-label="Удалить изображение"
                            />
                          </Box>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </FormControl>
              </VStack>
            </GridItem>
          </Grid>

          <Box mt={8}>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Создание..."
            >
              Создать экспонат
            </Button>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default ExhibitCreate; 