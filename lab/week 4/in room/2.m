i=imread('lena_gray_256.tif');

h3=fspecial('average',3);
f3= imfilter(i,h3,'replicate');


h5=fspecial('average',5);
f5= imfilter(i,h5,'replicate');

h7=fspecial('average',7);
f7= imfilter(i,h7,'replicate');

%imshow(i) , figure, imshow(f3), figure, imshow(f5), figure, imshow(f7)

K=imnoise(i,"salt & pepper",0.05);
h3=fspecial('average',3);
lowpass_img = imfilter(i,h3,'replicate');
%imshow(i) , figure, imshow(K), figure, imshow(lowpass_img)

L = medfilt2(K);
imshow(i), figure, imshow(K), figure, imshow(lowpass_img), figure, imshow(L)
