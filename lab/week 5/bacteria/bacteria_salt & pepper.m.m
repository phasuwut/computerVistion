
bacteria = imread('bacteria.tif');

bacteria_noise=imnoise(bacteria,'speckle')

bacteria_speckle_medfilt=medfilt2(bacteria_noise)

bacteria_salAndPepper=imnoise(bacteria,'salt & pepper')

bacteria_salAndPepper_medfilt=medfilt2(bacteria_salAndPepper)

imshow(bacteria), figure, imshow(bacteria_noise), figure, imshow(bacteria_speckle_medfilt), figure, imshow(bacteria_salAndPepper), figure, imshow(bacteria_salAndPepper_medfilt)

