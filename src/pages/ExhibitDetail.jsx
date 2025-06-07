import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Flex,
  Spinner,
  useToast,
  Divider,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getExhibitById, getCategories } from '../utils/api';
import { getStaticUrl } from '../utils/config';

const ExhibitDetail = () => {
  const { id } = useParams();
  const [exhibit, setExhibit] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Lightbox state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [exhibitData, categoriesData] = await Promise.all([
          getExhibitById(id),
          getCategories()
        ]);
        setExhibit(exhibitData);
        setCategories(categoriesData);
        // Собираем все изображения для lightbox и основной галереи
        const imgs = [];
        if (exhibitData?.image) imgs.push(exhibitData.image);
        if (Array.isArray(exhibitData?.additionalImages)) imgs.push(...exhibitData.additionalImages);
        setAllImages(imgs);
        setMainImageIndex(0); // Сбросить индекс при загрузке нового экспоната
      } catch (err) {
        console.error('Error loading exhibit:', err);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить информацию об экспонате',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, toast]);

  const openLightbox = idx => {
    setLightboxIndex(idx);
    onOpen();
  };
  const nextImage = () => setLightboxIndex((lightboxIndex + 1) % allImages.length);
  const prevImage = () => setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);

  // Для основной галереи
  const showPrevMainImage = (e) => {
    e.stopPropagation();
    setMainImageIndex((mainImageIndex - 1 + allImages.length) % allImages.length);
  };
  const showNextMainImage = (e) => {
    e.stopPropagation();
    setMainImageIndex((mainImageIndex + 1) % allImages.length);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!exhibit) {
    return (
      <Container maxW="container.xl" py={8} mt={20}>
        <Text textAlign="center" fontSize="lg" color="gray.500">
          Экспонат не найден
        </Text>
      </Container>
    );
  }

  const category = categories.find(c => c.id === exhibit.categoryId);

  return (
    <Container maxW="container.xl" py={8} mt={20}>
      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={8}
      >
        <Box>
          {/* Галерея изображений с переключением стрелками */}
          <Box position="relative">
            {allImages.length > 0 && (
              <>
                <Image
                  src={getStaticUrl(allImages[mainImageIndex])}
                  alt={exhibit.title}
                  borderRadius="lg"
                  width="100%"
                  height="auto"
                  objectFit="cover"
                  fallbackSrc="https://placehold.co/600x400/cccccc/333333?text=Нет+изображения"
                  cursor="pointer"
                  onClick={() => openLightbox(mainImageIndex)}
                />
                {allImages.length > 1 && (
                  <>
                    <IconButton
                      aria-label="Prev"
                      icon={<ChevronLeftIcon boxSize={8} />}
                      onClick={showPrevMainImage}
                      variant="ghost"
                      position="absolute"
                      left={2}
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={2}
                      bg="whiteAlpha.700"
                      _hover={{ bg: 'whiteAlpha.900' }}
                    />
                    <IconButton
                      aria-label="Next"
                      icon={<ChevronRightIcon boxSize={8} />}
                      onClick={showNextMainImage}
                      variant="ghost"
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={2}
                      bg="whiteAlpha.700"
                      _hover={{ bg: 'whiteAlpha.900' }}
                    />
                  </>
                )}
              </>
            )}
            {exhibit.additionalImages && exhibit.additionalImages.length > 0 && (
              <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                {[exhibit.image, ...exhibit.additionalImages].map((image, index) => (
                  <Image
                    key={index}
                    src={getStaticUrl(image)}
                    alt={`${exhibit.title} - дополнительное фото ${index}`}
                    borderRadius="md"
                    width="100%"
                    height="100px"
                    objectFit="cover"
                    fallbackSrc="https://placehold.co/600x400/cccccc/333333?text=Нет+изображения"
                    cursor="pointer"
                    border={mainImageIndex === index ? '2px solid #3182ce' : 'none'}
                    onClick={() => setMainImageIndex(index)}
                  />
                ))}
              </Grid>
            )}
          </Box>

          {/* Lightbox modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent bg="gray.900" color="white">
              <ModalCloseButton />
              <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
                <IconButton
                  aria-label="Prev"
                  icon={<ChevronLeftIcon boxSize={8} />}
                  onClick={prevImage}
                  variant="ghost"
                  position="absolute"
                  left={2}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={2}
                />
                <Image
                  src={getStaticUrl(allImages[lightboxIndex])}
                  alt=""
                  maxH="70vh"
                  maxW="90vw"
                  m="auto"
                  borderRadius="lg"
                  fallbackSrc="https://placehold.co/600x400/cccccc/333333?text=Нет+изображения"
                />
                <IconButton
                  aria-label="Next"
                  icon={<ChevronRightIcon boxSize={8} />}
                  onClick={nextImage}
                  variant="ghost"
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={2}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>

        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading size="xl" mb={2}>{exhibit.title}</Heading>
            <Badge colorScheme="blue" fontSize="md">
              {category?.name || 'Без категории'}
            </Badge>
          </Box>

          <Box>
            <Heading size="md" mb={2}>Описание</Heading>
            <Text textAlign="justify">{exhibit.description}</Text>
          </Box>

          <Divider />

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Box className="year-block" display="flex" flexDirection="column" alignItems="center" justifyContent="center" ml={10}>
                <Text fontSize="1rem" fontWeight={600} color="#7b8794" mb={1} textTransform="uppercase" letterSpacing="0.5px">Год</Text>
                <Text fontSize="2.8rem" fontWeight={800} color="#5B8AF5">{exhibit.year}</Text>
              </Box>
              <Box textAlign="justify" ml={300}>
                <Text fontWeight="bold">Производитель</Text>
                <Text>{exhibit.manufacturer}</Text>
              </Box>
            </Box>
          </Grid>

          {exhibit.historicalContext && (
            <Box>
              <Heading size="md" mb={2}>Исторический контекст</Heading>
              <Text textAlign="justify">{exhibit.historicalContext}</Text>
            </Box>
          )}

          {/* Технические характеристики с иконками */}
          {exhibit.technicalSpecs && (
            <Box>
              <Heading size="md" mb={2}>Технические характеристики</Heading>
              <VStack align="stretch" spacing={2}>
                {Array.isArray(exhibit.technicalSpecs) ? (
                  exhibit.technicalSpecs.map((spec, index) => (
                    <HStack key={index} align="center">
                      <CheckCircleIcon color="green.400" />
                      <Text fontWeight="bold">{spec.key}:</Text>
                      <Text>{spec.value}</Text>
                    </HStack>
                  ))
                ) : (
                  Object.entries(exhibit.technicalSpecs).map(([key, value]) => (
                    <HStack key={key} align="center">
                      <CheckCircleIcon color="green.400" />
                      <Text fontWeight="bold">{key}:</Text>
                      <Text>{value}</Text>
                    </HStack>
                  ))
                )}
              </VStack>
            </Box>
          )}

          {exhibit.interestingFacts && exhibit.interestingFacts.length > 0 && (
            <Box>
              <Heading size="md" mb={2}>Интересные факты</Heading>
              <VStack align="stretch" spacing={2}>
                {exhibit.interestingFacts.map((fact, index) => (
                  <Text key={index}>• {fact}</Text>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Grid>
    </Container>
  );
};

export default ExhibitDetail;