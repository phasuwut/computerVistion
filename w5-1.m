
rice =imread('rice_512.png');
imshow(rice)

rice_gray =rgb2gray(rice);
rice_bw_mat =mat2gray(rice_bw);
imshow(rice), figure, imshow(rice_gray), figure, imshow(rrice_bw_mat )

rice_level_1 = graythresh(rice_gray);


-------------


rice =imread('rice_512.png');
imshow(rice)
Warning: The initial magnification of the image is set to 'fit' in a docked figure. 
> In imshow (line 322) 
imshow(rice)
rice_bw=mat2gray(rice_bw);
Unrecognized function or variable 'rice_bw'.
 
rice_bw=mat2gray(rice);
imshow(rice_bw)
rice_level = graythresh(rice_bw);
rice_level 

rice_level =

    0.3471

rice_imb = im2bw(rice_bw,rice_level);
imshow(rice_imb)
[rice_L, rice_N] = bwlabel(rice_imb );
 D = regionprops(rice_L, 'area', 'perimeter');
imshow(rice), figure , imshow(rice_bw), figure, imshow(rice_imb )
 imshow(rice)
imshow(rice_bw)
 imshow(rice), figure , imshow(rice_bw), figure, imshow(rice_imb )
imshow(rice), figure , imshow(rice_bw), figure, imshow(rice_imb )