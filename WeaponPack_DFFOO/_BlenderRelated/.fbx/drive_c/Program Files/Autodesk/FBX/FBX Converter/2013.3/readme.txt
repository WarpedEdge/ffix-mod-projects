================================================================================

                                     README

               Autodesk FBX Converter 2013.3, September 11th 2012
               --------------------------------------------------


Welcome to the FBX Converter readme! This document includes the latest changes
since the previous release version of the Autodesk FBX Converter, such as new
features, bug fixes, known issues, deprecated functions/classes and previous
releases notes.

For more information, please visit us at http://www.autodesk.com/fbx/

To join the FBX Beta Program, please visit the Autodesk Feedback Community site
at http://beta.autodesk.com

Sincerely,
the Autodesk FBX team

================================================================================



==============================
1.0 Bug Fixes 2013.1 (Beta)

FBXX-84  Vertex normals in OBJ destroyed by FBX Converter 2012.1

1.1 Bug Fixes 2012.2 (Gold)

TMPL-84  FBX Converter UI Destination directory changed when a file rename is launched
TMPL-79  Texture paths are lost when importing then exporting
TMPL-76  2012.1 are shown at some place in the UI, need to replace with 2012.2

1.2 Bug Fixes 2012.1 (Gold)
000000   Add FBX Viewer tool (see documentation for details)
000000   Add FBX Explorer tool (see documentation for details)
000000   Add FBX Take Manager tool (see documentation for details)
377883   Add support for reading/writing MotionBuilder 2012 FBX files


==============================
2.0 Known limitations

2.1 3ds Max conversion limitations:

	Maximum character limit for names:
		-Material names: 12 characters
		-Texture names: 9 characters
		-Mesh names: 7 characters max 
		-Parent names: 17 characters

	Texture files are copied in the same directory as the .3ds file.
		-Mapping information is preserved, but the path is not retained

	Skins/Morphs are not supported.

==============================
3.0 Frequently Asked Questions

3.1 What is FBX version 2012?

When you convert an FBX file to the FBX 2012 FBX Version, the file becomes
compatible with the Autodesk FBX 2012 Plug-ins (i.e. 2012.2).

If you are using an older FBX Plug-in version in your destination application, we
recommend that you update the destination application's FBX Plug-in.
Otherwise, you must convert your FBX file to the corresponding FBX Version 
(e.g. FBX 2009) so your FBX files are compatible.

3.2 What happened to my old command line arguments?

If you use the FBX Converter command line version (FbxConverter.exe) for batch
processing or through a script, you may need to update these batch files or scripts
This is because some command line arguments have changed in the 2009 versions of
the Converter.  However, the default values have not changed. 

The following arguments have been renamed:

"/smoothgroup" has been replaced with "/splitnormals" 
"/refnode" has been replaced with "/addroot" 
"/rescale" has been replaced with "/convertunit" 
"/texuvbypoly" has been replaced with "/uvbypoly"

===================================================================================
