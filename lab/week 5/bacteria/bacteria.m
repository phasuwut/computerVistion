im = imread('bacteria.tif');
imshow(im)
imhist(im)
imtool(im)
imshow(im), figure, imhist(im), figure, imtool(im)

level = graythresh(im)
imb = im2bw(im,level);
imshow(im), figure, imshow(imb)

[L, N] = bwlabel(imb);

 D = regionprops(L, 'area', 'perimeter');
 D
 D(1)
 D(2)


imb_x0 = im2bw(im,0);
imb_x1 = im2bw(im,0.1);
imb_x2 = im2bw(im,0.2);
imb_x3 = im2bw(im,0.3);
imb_x4 = im2bw(im,0.4);
imb_x5 = im2bw(im,0.5);
imb_x6 = im2bw(im,0.6);
imb_x7 = im2bw(im,0.7);
imb_x8 = im2bw(im,0.8);
imb_x9 = im2bw(im,0.9);
imb_x10 = im2bw(im,1);
imshow(im), figure, imshow(imb_x0), figure, imshow(imb_x1), figure, imshow(imb_x2), figure, imshow(imb_x3), figure, imshow(imb_x4), figure, imshow(imb_x5), figure, imshow(imb_x6), figure, imshow(imb_x7), figure, imshow(imb_x8), figure, imshow(imb_x9), figure, imshow(imb_x10)





im1 = imread('bacteria.tif');
im2=mat2gray(im1)
%imshow(im1), figure, imshow(im2)

level_1 = graythresh(im1)
level_2 = graythresh(im2)
imb = im2bw(im1);
imb1 = im2bw(im1,level_1);
imb2 = im2bw(im2,level_2);
imshow(im1), figure, imshow(im2),  figure, imshow(imb),figure, imshow(imb1), figure, imshow(imb2)
