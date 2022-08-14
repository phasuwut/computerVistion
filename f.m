R = input ('Please input the R side');
G = input ('Please input the G side');
B = input ('Please input the B side');

print1="CMY"
[C,M,Y] = CMY(R,G,B)


print2="YUV"
[y,u,v]= YUV(R,G,B)


function [C,M,Y] = CMY(r,g,b)
    C=(1-r)
    M=1-g
    Y=1-b
end

function [y,u,v]= YUV(R,G,B)
    y=(0.3*R)+(0.6*G)+(0.1*B)
    u=B-y
    v=R-y;
end


