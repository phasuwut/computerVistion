classdef GoogLeNetPackageInfo < matlab.addons.internal.SupportPackageInfoBase
    %Googlenet support package support for MATLAB Compiler.
    
    %   Copyright 2017-2018 The MathWorks, Inc.
    
    methods
        function obj = GoogLeNetPackageInfo()
            obj.baseProduct = 'Deep Learning Toolbox';
            obj.displayName = 'Deep Learning Toolbox Model for GoogLeNet Network';
            obj.name        = 'Deep Learning Toolbox Model for GoogLeNet Network';
            
            sproot = matlabshared.supportpkg.getSupportPackageRoot();
            
            % Define all the data that should be deployed from the support
            % package. This includes the actual language data, which will
            % be archived in the CTF.
            obj.mandatoryIncludeList = {...
                fullfile(sproot, 'toolbox','nnet','supportpackages','googlenet','+nnet') ...
                fullfile(sproot, 'toolbox','nnet','supportpackages','googlenet','license_addendum.txt') ...
                fullfile(sproot, 'toolbox','nnet','supportpackages','googlenet','data','googlenet.mat') };
            
            % Specify that the googlenet.mat data file should only be
            % suggested in the deploy app if the googlenet.m file is used in
            % the application code. Otherwise, there is no need to mention
            % it.
            obj.conditionalIncludeMap = containers.Map;
            obj.conditionalIncludeMap(fullfile(toolboxdir('nnet'), 'cnn', 'spkgs', 'googlenet.m')) = {};
            
        end
    end
end
