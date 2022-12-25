rice = imread('rice_512.png');
imshow(rice)

%rice_gray =im2gray(rice)
rice_gray=mat2gray(rice)

rice_level = graythresh(rice_gray)
im_rice = im2bw(rice_gray ,rice_level);

[rice_L, rice_N] = bwlabel(im_rice);
 D = regionprops(rice_L, 'area', 'perimeter');

 imshow(rice), figure, imshow(rice_gray), figure, imshow(im_rice)



