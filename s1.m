R = input ('Please input the R side');
G = input ('Please input the G side');
B = input ('Please input the B side');

print1="CMY"
C=(1-R)
M=1-G
y=1-B

print2="YUV"

Y=(0.3*R)+(0.6*G)+(0.1*B)
U=B-Y
v=R-Y
