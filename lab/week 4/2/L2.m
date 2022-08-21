i=imread('lena_gray_256.tif');

L_1=imnoise(i,"salt & pepper",0.20);

L_2 = fspecial('average',7);
L_2_m= imfilter(i,L_2,'replicate');

L_3 = medfilt2(i);
imshow(L_1) , figure, imshow(L_2_m),figure, imshow(L_3),