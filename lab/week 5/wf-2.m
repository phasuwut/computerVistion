i=imread('bacteria.tif');

im=imnoise(i,'speckle');
imshow(im)

imshow(i), figure, imshow(im)

imm=medfilt2(im)
imshow(i), figure, imshow(im),figure, imshow( imm)

imn=imnoise(i,'salt & pepper');
imnn= medfilt2(imn

imshow(i), figure, imshow(im),figure, imshow(imm), figure, imshow(imn),figure, imshow(imnn)