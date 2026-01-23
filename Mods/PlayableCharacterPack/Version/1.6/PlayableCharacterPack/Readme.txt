//========================================================//
//           Final Fantasy IX - Steam Version             //
//========================================================//
//                Playable Characters Pack                //
//                      Version 1.6                       //
//                by Tirlititi & WarpedEdge               //
//========================================================//

INSTALL
-------

Use Memoria's Mod Manager to download and install this mod.
Then set this mod's priority to be higher than the priority of the Moguri mod but lower than other mods and activate it.



CHANGELOGS:
-----------

Release 1.6 adds the following characters with their own unique abilities and skills:
- Mikoto: Female Terran like Zidane wielding Throwing stars
- Gerome: Male Terran like Zidane wielding Axes
- Ruby: Tantalus crew member wielding Rackets
- Baku: Leader of Tantalus wielding Swords

Release 1.5 Adds the following characters with their own unique abilities and skills:
- Haagen: Pluto Knight wielding Swords
- Kohel: Pluto Knight wielding Spears
- Aria: Alexandrian Knight wielding Claws
- Ophelia: Alexandrian Knight wielding Swords
- Dan: Burmecian soldier Dan wielding Daggers
- Jeame: Cleyra Dancer wielding Rackets
- Puck: Our little rat prince wielding rods, staves and swords
- Blank - New Costume: Pluto Knight Armor

Releases 1.0, 1.1 and 1.2: Adds unique abilities and equipments for Kuja, Lani and Fratley.

Release 0.5: Adds Kuja, Lani and Fratley as playable characters.



DOCUMENTATION:
--------------

WARNING: this is the documentation I wrote for the mod "Play as Kuja".
It is outdated to some extent but many things are still relevant.
Check out Memoria's wiki page: it may be the place at which modding documentation regarding Memoria will get maintained.
https://github.com/Albeoris/Memoria/wiki

Also it barely includes infos about the work WarpedEdge has made on the mod. You can check his wiki page that provides additional documentation though:
https://github.com/WarpedEdge/ffix-mod-projects/wiki

For Modders: Besides the characters IDs, we use the ID range 10000-10999 for Commands, Spells, Items, etc.
For mod compatibility, please use a range other mods are not using unless you are overwriting them on purpose.

================
=== In menus ===
================

Replacing a character by another one in the menus is rather simple: you only need to change the character's portraits and default name.

The icons of all playable characters are in the file "FF9_Data\EmbeddedAsset\UI\Atlas\face atlas" which is a PNG file that can be opened by any image editing tool (possibly after renaming it with the extension ".png", but keep in mind that the game requires the extension to be removed for that asset, since there is no extension in the asset's internal path).

The background image in the naming menu is in the file "FF9_Data\EmbeddedAsset\UI\Sprites\name00" since we replace Zidane (the "playable character 0") by Kuja. It would be "FF9_Data\EmbeddedAsset\UI\Sprites\name01" for replacing the naming screen background of Vivi etc. It is a PNG file as well.

Also, there is a short description of that character in the naming menu. This description in every languages provided by the game is stored in the file "FF9_Data\EmbeddedAsset\Manifest\Text\localization.txt" that contains a lot of texts (mainly UI-related, about the interface). The description in each language is stored in the line starting by "CharacterProfile0". For instance, in this mod, that line can be read as the following:
CharacterProfile0,Race: Genome\nGender: Male\nAge: 24\nDominant Hand: Right,Race: Genome\nGender: Male\nAge: 24\nDominant Hand: Right,種族：ジェノム\n性別：男\n年齢：24歳\n利き腕：右利き,Raza: genómido.\nSexo: masculino.\nEdad: 24 años.\nMano predominante: derecha.,Type : génome\nSexe : masculin\nÂge : 24 ans\nDroitier,Volk: Genom\nGeschlecht: Männlich\nAlter: 24 Jahre\nRechtshänder,Clan: jenoma\nSesso: maschio\nEtà: 24 anni\nMano dominante: destra
Note that the escape sequence "\n" is used to display a line break in-game.

The character's default name, however, is changed in the file "DictionaryPatch.txt" with the few lines "CharacterDefaultName 0 LANG Kuja".

Concerning naming menus, the identifiers of playable characters are ordered as follows:
0 -> Zidane
1 -> Vivi
2 -> Garnet
3 -> Steiner
4 -> Freya
5 -> Quina
6 -> Eiko
7 -> Amarant

==================================
=== On the field and world map ===
==================================

This is the aspect of this mod that was the least worked on.
There are 2 ways of having the player control Kuja or another character on the field and world map:
(1) Hijack 3D model's database to make the game use Kuja's 3D model and animations in place of Zidane's. This is the solution employed in this mod: it achieves some result through the whole game with very little work but has many drawbacks.
(2) Modify the game's scripts and cutscenes, to include Kuja instead of Zidane.

Indeed, there is pretty much no restriction by default on "who is the player controlling" and it could be any 3D model (like in the short section in the Desert Palace where the player controls Cid the Frog in the normal game). However, Zidane has much more animations than any other since he is in more situations than the rest of the characters, playable or not. A proper "PlayAsXXXX" mod would thus require to create many animations (eg.: picking up items on the floor, climbing a ladder, various talking gestures...). How to create animations is described further on.

In order to have a clean mod, all of Zidane's animations should have been hijacked into an animation of Kuja, even when using that method (1).

=================
=== In battle ===
=================

PlayerBattleModel
GEO_SUB_F0_KJA                -> 3D Model used in battle (normal)
GEO_SUB_F0_KJG                -> 3D Model used in battle (trance)
ANH_SUB_F0_KJA_ARMS_CROSS_2_2 -> Animation used for stand (MP_IDLE_NORMAL)
ANH_SUB_F0_KJA_ARMS_CROSS_2_2 -> Animation used for low HP (MP_IDLE_DYING)
ANH_MON_B3_125_003            -> Animation used for hitted (MP_DAMAGE1)
ANH_MON_B3_125_040            -> Animation used for hitted strongly (MP_DAMAGE2) [Note that the transition KO -> stand is usually played right after]
ANH_SUB_F0_KJA_CUSTOM_KO      -> Animation used for KO (MP_DISABLE)
ANH_SUB_F0_KJA_ARMS_CROSS_2_2 -> Animation used for the transition low HP -> stand (MP_GET_UP_DYING)
ANH_SUB_F0_KJA_CUSTOM_RAISE   -> Animation used for the transition KO -> stand (MP_GET_UP_DISABLE)
ANH_SUB_F0_KJA_ARMS_CROSS_2_2 -> Animation used for hit hard (MP_DOWN_DYING)
ANH_SUB_F0_KJA_CUSTOM_GETKO   -> Animation used for the transition stand -> KO (MP_DOWN_DISABLE)
ANH_SUB_F0_KJA_IDLE           -> Animation used for ready (MP_IDLE_CMD)
ANH_SUB_F0_KJA_ARMS_CROSS_2_3 -> Animation used for the transition stand -> ready (MP_NORMAL_TO_CMD)
ANH_SUB_F0_KJA_ARMS_CROSS_2_2 -> Animation used for the transition KO -> low HP (MP_DYING_TO_CMD)
ANH_SUB_F0_KJA_SHOW_OFF_1_1   -> Animation used for the transition stand -> defend (MP_IDLE_TO_DEF)
ANH_SUB_F0_KJA_SHOW_OFF_1_2   -> Animation used for defend (MP_DEFENCE)
ANH_SUB_F0_KJA_SHOW_OFF_1_3   -> Animation used for the transition defend -> stand (MP_DEF_TO_IDLE)
ANH_MON_B3_125_021            -> Animation used for cover (MP_COVER)
ANH_SUB_F0_KJA_LAUGH_2_2      -> Animation used for dodge (MP_AVOID)
ANH_SUB_F0_KJA_CUSTOM_FLEE    -> Animation used for flee (MP_ESCAPE)
ANH_SUB_F0_KJA_OJIGI_1        -> Animation used for victory (MP_WIN)
ANH_SUB_F0_KJA_OJIGI_2        -> Animation used for stand victory (MP_WIN_LOOP)
ANH_SUB_F0_KJA_GET_HSK_1      -> Animation used for the transition stand -> run (MP_SET)
ANH_SUB_F0_KJA_GET_HSK_2      -> Animation used for run (MP_RUN)
ANH_SUB_F0_KJA_GET_HSK_2      -> Animation used for the transition run -> attack (MP_RUN_TO_ATTACK)
ANH_SUB_F0_KJA_GET_HSK_3      -> Animation used for attack (MP_ATTACK)
ANH_SUB_F0_KJA_ARMS_CROSS_2_1 -> Animation used for jump back (MP_BACK)
ANH_SUB_F0_KJA_ARMS_CROSS_2_2 -> Animation used for the transition jump back -> stand (MP_ATK_TO_NORMAL)
ANH_MON_B3_125_020            -> Animation used for the transition stand -> cast (MP_IDLE_TO_CHANT)
ANH_MON_B3_125_021            -> Animation used for cast (MP_CHANT)
ANH_MON_B3_125_022            -> Animation used for the transition cast -> stand (MP_MAGIC)
ANH_SUB_F0_KJA_WALK           -> Animation used for move forward (MP_STEP_FORWARD)
ANH_SUB_F0_KJA_WALK           -> Animation used for move backward (MP_STEP_BACK)
ANH_SUB_F0_KJA_RAIN_1         -> Animation used for item (MP_ITEM1)
ANH_SUB_F0_KJA_ARMS_CROSS_2_1 -> Animation used for the transition ready -> stand (MP_CMD_TO_NORMAL)
ANH_SUB_F0_KJG_KICK_GRL_1     -> Animation used for cast alternate (MP_SPECIAL1) [used by commands like "Focus" or "Steal"]

The default battle character slots are ordered as follows:
0  -> Zidane with daggers
1  -> Zidane with thief swords
2  -> Vivi
3  -> Garnet long hair with rods
4  -> Garnet long hair with rackets
5  -> Garnet short hair with rods
6  -> Garnet short hair with rackets
7  -> Steiner "outdoor"
8  -> Steiner "indoor" [In practice, I think this slot is never used]
9  -> Quina
10 -> Eiko with flutes
11 -> Eiko with rackets
12 -> Freya
13 -> Amarant
14 -> Cinna
15 -> Marcus
16 -> Blank
17 -> Blank in Pluto armor
18 -> Beatrix

=========================
=== Custom animations ===
=========================

As of the latest Memoria update (that also introduced the DictionaryPatch commands used for this mod), animations can be read from files directly placed in the hard drive both in Unity's binary serialized format and as a custom JSON format (that can be dealt with using a text editor).
Hades Workshop's latest update also allows to export animations as this JSON format in its Unity Assets Viewer.

The JSON format is fairly readable by itself but tedious to modify directly with a text editor that can't visualise movements. In case you try doing that, the only non-obvious thing to know is that rotations are given as quaternions. Also, for now, the "InnerTangent" and "OuterTangent" properties are ignored by Memoria so don't bother (it might be that they are automatically recomputed during runtime).
The name given in the JSON is also ignored and replaced by whichever name is provided in the DictionaryPatch.txt.

The path to put a custom animation is the following:
"StreamingAssets\Assets\Resources\Animations\[MODEL ID]\[ANIMATION ID].anim"
where [MODEL ID] is the ID of the model tied with the animation.
Internally, animations are first tied to models sharing the same identifier part of their name. A model is named "GEO_[IDENTIFIER_TWO_UNDERSCORES]" and animations directly tied to them are named "ANH_[IDENTIFIER_TWO_UNDERSCORES]_COMPACT_DESCRIPTION".
Thus, you should declare animations like "3DModelAnimation [ANIM ID] ANH_[IDENTIFIER_MODEL_X]_WHATEVER" and put the animation file in model X's folder (that is, a folder named by the ID of the model X) even if you subsequently wish to use that animation with other models.

Thus, "ANH_SUB_F0_KJA_CUSTOM_KO" has been placed in the folder "StreamingAssets\Assets\Resources\Animations\267\" because 267 is the ID of "GEO_SUB_F0_KJA".

Spreadsheets in the documentation list IDs of models, animations etc.
They can also be found in Hades Workshop's source code:
https://github.com/Tirlititi/Hades-Workshop/blob/master/Source/Database_Resource.h
https://github.com/Tirlititi/Hades-Workshop/blob/master/Source/Database_Animation.h

Animation IDs of the game natively go up to 14739 (there are many holes, so there are way less than 14740 animations in the whole game), which is why I give custom animations not replacing existing animations an ID of 20000 or higher to avoid interferences.
IDs may be very high numbers in theory but they should always be 65535 or less in order to be used in field / world map scripts (for battle usage, I could have chosen 100000 though).

On top of that, existing animations can be replaced by custom ones.
"3DModelAnimation 38 ANH_SUB_F0_KJA_CUSTOM_RUN" replaces Zidane's running animation by a custom run animation for Kuja. Note that the folder of the animation changed in the process: the animation file is put in the folder "StreamingAssets\Assets\Resources\Animations\267\" (SUB_F0_KJA's folder) instead of "StreamingAssets\Assets\Resources\Animations\98\" (Zidane's usual model animation folder).
Other animations were replaced with adjustments for model compatibility issues, which is why you can find "StreamingAssets\Assets\Resources\Animations\267\4285.anim" or animations in subfolders 531, 566 and 567 of this mod.

==============================
=== Skeleton compatibility ===
==============================

Lastly, I describe how I managed to make Trance Kuja and Kuja's animations compatible with both models (mostly).

First, the skeleton of both models should match. When an animation is played on a model whose skeleton doesn't match, it makes fuzzy movements.
Unfortunatly, the skeleton of Trance Kuja's model doesn't match the one of Kuja by default. In summary, the two skeletons are organized like that:

KUJA:
bone000/bone001/bone003/bone004/bone005/bone006         -> right foot
bone000/bone001/bone003/bone007                         -> right clothes
bone000/bone001/bone008/bone009/bone010/bone011         -> left foot
bone000/bone001/bone008/bone012                         -> left clothes
bone000/bone013/bone014/bone015/bone016/bone017/bone018 -> right hand
bone000/bone013/bone019/bone020/bone021/bone022/bone023 -> hair
bone000/bone013/bone024/bone025/bone026/bone027/bone028 -> left hand

TRANCE KUJA:
bone000/bone001/bone002/bone003/bone004/bone005/bone006 -> tail
bone000/bone001/bone007/bone008/bone009/bone010         -> right foot
bone000/bone001/bone007/bone011                         -> right clothes
bone000/bone001/bone012/bone013/bone014/bone015         -> left foot
bone000/bone016/bone017/bone018/bone019/bone020/bone021 -> right hand
bone000/bone016/bone022/bone023/bone024/bone025/bone026 -> hair
bone000/bone016/bone027/bone028/bone029/bone030/bone031 -> left hand

You can see that
(i) there are parts like the tail of Trance Kuja that don't have an equivalent in Kuja's model and
(ii) parts that are equivalent don't have necessarily the same bone names / numbers.

(Bones can be theoretically called with any name, but Final Fantasy IX's Steam port only uses names formatted like those, which is important for compatibility with the PSX bone IDs that are only numerical)

In order to adress the issue (ii), one must rename the bones of either one of these models. I renamed the bones of Trance Kuja's model, and that is the purpose of the file "StreamingAssets\p0data4.bin".

In Hades Workshop's Unity Assets Viewer, I searched for Trance Kuja's model asset. It is in the archive "p0data4.bin", with path "assets/resources/models/5/531.fbx" (with file type "1 (GameObject)". The feature "right-click -> Export model hierarchy of selection" generates a text file displaying the Unity serialization structure of the model (in short: this "GameObject" is only a small part of the actual 3D model, but that small part references other small parts, most of them having no name and scattered randomly in the p0data4 archive), and as a side-effect it selects all the assets that are part of Trance Kuja's model.

Once all the small parts of Trance Kuja's model were selected, holding Ctrl can be used to add to the selection the model's texture (which are referenced differently and thus not added to the selection) and the asset "AssetBundle". At that step, all the assets of this archive that are required for Trance Kuja's model should be selected.

Then, "right-click -> Invert selection" and "right-click -> Delete assets" will generate a much smaller version of the archive p0data4.bin, containing pretty much only Trance Kuja's model.

This archive, I opened it in a non-conventional way with the tool Notepad++, which is a text editor that is clean enough to be able to edit the texts in binary files without corrupting it. There are a lot of binary gibberish there but one can search for words "bone000" and replace it by something else AS LONG AS the text you replace it with has EXACTLY the same length as the text being replaced. That is exactly what we need here.

Using "Find / Replace all", I replaced all the occurences of "bone002" to "bone102" for disjointing Trance Kuja's tail from the rest of the model, then same with:
- "bone003" up to "bone006" -> replaced by "bone103" up to "bone106"
- "bone007" up to "bone015" -> replaced by "bone003" up to "bone011"
- "bone016"                 -> replaced by "bone013"
- "bone017" up to "bone031" -> replaced by "bone014" up to "bone028"

That way, my custom p0data4.bin archive contained Trance Kuja's model with an altered skeleton.

TRANCE KUJA ALTERED:
bone000/bone001/bone102/bone103/bone104/bone105/bone106 -> tail
bone000/bone001/bone003/bone004/bone005/bone006         -> right foot
bone000/bone001/bone003/bone007                         -> right clothes
bone000/bone001/bone008/bone009/bone010/bone011         -> left foot
bone000/bone013/bone014/bone015/bone016/bone017/bone018 -> right hand
bone000/bone013/bone019/bone020/bone021/bone022/bone023 -> hair
bone000/bone013/bone024/bone025/bone026/bone027/bone028 -> left hand

As an optional step, I modified the asset "AssetBundle" in order to hide informations of all the assets of the original p0data4.bin that were deleted (if you can do the step above, you can spot how I did that).

Now, the only thing that was left was to update all of Trance Kuja's animations to match that updated skeleton.
The Unity Assets Vierwer can extract all of Trance Kuja's animations (folders 531 (Trance Kuja's field animations), 566 (battle animations in Memoria) and 567 (battle animations in Pandemonium)) and using the "Search / Replace all in files" feature of Notepad++, the same name update can be done pretty fast.

Additionally, I added tail movements to Kuja's animations in the folder 267, simply copy-pasting the moves of "bone102" etc. of Trance Kuja's idle animation to Kuja's animations and updating the frames to match the duration of each of these animations of Kuja.

In order to have something 100% clean, one should have exported all of Kuja's animations and add tail movements to them the same way: as it is now, Trance Kuja's tail doesn't move at all (in battle) when playing most of its animations (eg. its "Cast" animations).

Same thing could be done to add movements of "bone012" (Kuja's left clothes) to Trance Kuja's animations, in order for them to be fully adapted to Kuja's model as well.

Finally, doing the same kind of bone renaming starting with Garnet's fleeing animation (the skeleton of which is given below FYI), a proper fleeing / running animation could be created for Kuja and Trance Kuja's model.

GARNET (LONG HAIR):
bone000/bone001/bone002/bone003/bone004/bone005         -> right foot
bone000/bone001/bone006/bone007/bone008/bone009         -> left foot
bone000/bone010/bone011/bone012/bone013/bone014/bone015 -> right hand
bone000/bone010/bone016/bone017                         -> pendant
bone000/bone010/bone018/bone019/bone020/bone021/bone022 -> hair
bone000/bone010/bone023/bone024/bone025/bone026/bone027 -> left hand

==============================
=== Memoria's Model Viewer ===
==============================

The followings are the export parameters I used for exporting many animations with Memoria, to port some animations from a model to another one.

= Animations for Kuja =
// Kuja's bone hierarchy
bone000
bone000/bone001
bone000/bone001/bone002
bone000/bone001/bone003
bone000/bone001/bone003/bone004
bone000/bone001/bone003/bone004/bone005
bone000/bone001/bone003/bone004/bone005/bone006				RIGHT FOOT
bone000/bone001/bone003/bone007
bone000/bone001/bone008
bone000/bone001/bone008/bone009
bone000/bone001/bone008/bone009/bone010
bone000/bone001/bone008/bone009/bone010/bone011				LEFT FOOT
bone000/bone001/bone008/bone012
bone000/bone013
bone000/bone013/bone014
bone000/bone013/bone014/bone015
bone000/bone013/bone014/bone015/bone016
bone000/bone013/bone014/bone015/bone016/bone017
bone000/bone013/bone014/bone015/bone016/bone017/bone018		RIGHT HAND
bone000/bone013/bone019
bone000/bone013/bone019/bone020
bone000/bone013/bone019/bone020/bone021						HEAD
bone000/bone013/bone019/bone020/bone021/bone022
bone000/bone013/bone019/bone020/bone021/bone022/bone023		HAIR
bone000/bone013/bone024
bone000/bone013/bone024/bone025
bone000/bone013/bone024/bone025/bone026
bone000/bone013/bone024/bone025/bone026/bone027
bone000/bone013/bone024/bone025/bone026/bone027/bone028		LEFT HAND


// Exporting animations from Beatrix to be used by Kuja's model
BoneHierarchy:
bone000
bone000/bone001
bone000/bone001/bone002
bone000/bone001/bone003
bone000/bone001/bone003/bone004
bone000/bone001/bone003/bone004/bone005
bone000/bone001/bone003/bone004/bone005/bone006
bone000/bone001/bone008
bone000/bone001/bone008/bone009
bone000/bone001/bone008/bone009/bone010
bone000/bone001/bone008/bone009/bone010/bone011
bone000/bone013
bone000/bone013/bone014
bone000/bone013/bone014/bone015
bone000/bone013/bone014/bone015/bone016
bone000/bone013/bone014/bone015/bone016/bone017
bone000/bone013/bone014/bone015/bone016/bone017/bone018
bone000/bone013/bone019
bone000/bone013/bone019/bone020
bone000/bone013/bone019/bone020/bone021


bone000/bone013/bone024
bone000/bone013/bone024/bone025
bone000/bone013/bone024/bone025/bone026
bone000/bone013/bone024/bone025/bone026/bone027
bone000/bone013/bone024/bone025/bone026/bone027/bone028


= Animations for Fratley =
// Fratley's bone hierarchy
bone000
bone000/bone001
bone000/bone001/bone002
bone000/bone001/bone002/bone003
bone000/bone001/bone002/bone003/bone004
bone000/bone001/bone002/bone003/bone004/bone005
bone000/bone001/bone002/bone003/bone004/bone005/bone006		RIGHT FOOT
bone000/bone001/bone007
bone000/bone001/bone007/bone008
bone000/bone001/bone007/bone008/bone009
bone000/bone001/bone007/bone008/bone009/bone010
bone000/bone001/bone007/bone008/bone009/bone010/bone011		LEFT FOOT
bone000/bone001/bone012
bone000/bone001/bone012/bone013
bone000/bone001/bone012/bone013/bone014
bone000/bone001/bone012/bone013/bone014/bone015				TAIL
bone000/bone016
bone000/bone016/bone017
bone000/bone016/bone017/bone018
bone000/bone016/bone017/bone018/bone019
bone000/bone016/bone017/bone018/bone019/bone020
bone000/bone016/bone017/bone018/bone019/bone020/bone021		RIGHT HAND
bone000/bone016/bone022
bone000/bone016/bone022/bone023
bone000/bone016/bone022/bone023/bone024						HEAD
bone000/bone016/bone025
bone000/bone016/bone025/bone026
bone000/bone016/bone025/bone026/bone027
bone000/bone016/bone025/bone026/bone027/bone028				LEFT HAND

// Exporting animations from Freya to be used by Fratley's model
AnimPatch:bone000;localPosition;(0, -60, 0)
AnimPatch:bone000/bone001;localRotation;Euler(-90, 90, 30)
AnimPatch:bone000/bone001/bone002;localRotation;Euler(0, 30, -20)
AnimPatch:bone000/bone001/bone007;localRotation;Euler(10, -30, 30)
AnimPatch:bone000/bone001/bone012;localRotation;Euler(60, 70, 0)
BoneHierarchy:
bone000
bone000/bone016
bone000/bone016/bone025
bone000/bone016/bone025/bone026
bone000/bone016/bone025/bone026/bone027
bone000/bone016/bone025/bone026/bone027/bone028

bone000/bone016/bone022
bone000/bone016/bone022/bone023
bone000/bone016/bone017
bone000/bone016/bone017/bone018
bone000/bone016/bone017/bone018/bone019
bone000/bone016/bone017/bone018/bone019/bone020
bone000/bone001/bone007

bone000/bone001/bone007/bone008
bone000/bone001/bone007/bone008/bone009
bone000/bone001/bone007/bone008/bone009/bone010
bone000/bone001/bone007/bone008/bone009/bone010/bone011
bone000/bone001/bone002

bone000/bone001/bone002/bone003
bone000/bone001/bone002/bone003/bone004
bone000/bone001/bone002/bone003/bone004/bone005
bone000/bone001/bone002/bone003/bone004/bone005/bone006
bone000/bone001/bone012
bone000/bone001/bone012/bone013
bone000/bone001/bone012/bone013/bone014
bone000/bone001/bone012/bone013/bone014/bone015

= Animations for Lani =
// Lani's bone hierarchy (battle model)
bone000
bone000/bone001
bone000/bone001/bone002
bone000/bone001/bone002/bone003								ROBE
bone000/bone001/bone004
bone000/bone001/bone004/bone005
bone000/bone001/bone004/bone005/bone006
bone000/bone001/bone004/bone005/bone006/bone007				RIGHT FOOT
bone000/bone001/bone004/bone008
bone000/bone001/bone009
bone000/bone001/bone009/bone010
bone000/bone001/bone009/bone010/bone011
bone000/bone001/bone009/bone010/bone011/bone012				LEFT FOOT
bone000/bone001/bone009/bone013
bone000/bone014
bone000/bone014/bone015
bone000/bone014/bone015/bone016
bone000/bone014/bone015/bone016/bone017
bone000/bone014/bone015/bone016/bone017/bone018
bone000/bone014/bone015/bone016/bone017/bone018/bone019		RIGHT HAND
bone000/bone014/bone020
bone000/bone014/bone020/bone021
bone000/bone014/bone020/bone021/bone022						HEAD
bone000/bone014/bone020/bone021/bone022/bone023				HAIR
bone000/bone014/bone020/bone021/bone024
bone000/bone014/bone020/bone021/bone024/bone025				HAIR
bone000/bone014/bone020/bone021/bone026
bone000/bone014/bone027
bone000/bone014/bone027/bone028
bone000/bone014/bone027/bone028/bone029
bone000/bone014/bone027/bone028/bone029/bone030
bone000/bone014/bone027/bone028/bone029/bone030/bone031		LEFT HAND

// Exporting animations from Lani's field model to be used by Lani's battle model
BoneHierarchy:
bone000
bone000/bone001
bone000/bone001/bone002
bone000/bone001/bone002/bone003
bone000/bone001/bone004
bone000/bone001/bone004/bone005
bone000/bone001/bone004/bone005/bone006
bone000/bone001/bone004/bone005/bone006/bone007
bone000/bone001/bone004/bone008
bone000/bone001/bone009
bone000/bone001/bone009/bone010
bone000/bone001/bone009/bone010/bone011
bone000/bone001/bone009/bone010/bone011/bone012
bone000/bone001/bone009/bone013
bone000/bone014
bone000/bone014/bone015
bone000/bone014/bone015/bone016
bone000/bone014/bone015/bone016/bone017
bone000/bone014/bone015/bone016/bone017/bone018
bone000/bone014/bone015/bone016/bone017/bone018/bone019
bone000/bone014/bone020
bone000/bone014/bone020/bone021
bone000/bone014/bone020/bone021/bone022
bone000/bone014/bone027
bone000/bone014/bone027/bone028
bone000/bone014/bone027/bone028/bone029
bone000/bone014/bone027/bone028/bone029/bone030
bone000/bone014/bone027/bone028/bone029/bone030/bone031

// Exporting animations from Amarant's model to be used by Lani's model
BoneHierarchy:
bone000
bone000/bone001
bone000/bone001/bone004
bone000/bone001/bone004/bone005
bone000/bone001/bone004/bone005/bone006
bone000/bone001/bone004/bone005/bone006/bone007
bone000/bone001/bone009
bone000/bone001/bone009/bone010
bone000/bone001/bone009/bone010/bone011
bone000/bone001/bone009/bone010/bone011/bone012
bone000/bone014

bone000/bone014/bone015
bone000/bone014/bone015/bone016
bone000/bone014/bone015/bone016/bone017
bone000/bone014/bone015/bone016/bone017/bone018
bone000/bone014/bone015/bone016/bone017/bone018/bone019
bone000/bone014/bone020
bone000/bone014/bone020/bone021
bone000/bone014/bone027
bone000/bone014/bone027/bone028
bone000/bone014/bone027/bone028/bone029
bone000/bone014/bone027/bone028/bone029/bone030
bone000/bone014/bone027/bone028/bone029/bone030/bone031

= Animations for Zidane (Pluto) =
// Zidane's bone hierarchy (Pluto model)
bone000
bone000/bone001
bone000/bone001/bone002
bone000/bone001/bone002/bone003
bone000/bone001/bone002/bone003/bone004
bone000/bone001/bone002/bone003/bone004/bone005				TAIL?
bone000/bone001/bone006
bone000/bone001/bone006/bone007
bone000/bone001/bone006/bone007/bone008
bone000/bone001/bone006/bone007/bone008/bone009				RIGHT FOOT
bone000/bone001/bone010
bone000/bone001/bone010/bone011
bone000/bone001/bone010/bone011/bone012
bone000/bone001/bone010/bone011/bone012/bone013				LEFT FOOT
bone000/bone014
bone000/bone014/bone015
bone000/bone014/bone015/bone016
bone000/bone014/bone015/bone016/bone017
bone000/bone014/bone015/bone016/bone017/bone018
bone000/bone014/bone015/bone016/bone017/bone018/bone019		RIGHT HAND
bone000/bone014/bone020
bone000/bone014/bone020/bone021								HEAD
bone000/bone014/bone022
bone000/bone014/bone022/bone023
bone000/bone014/bone022/bone023/bone024
bone000/bone014/bone022/bone023/bone024/bone025
bone000/bone014/bone022/bone023/bone024/bone025/bone026		LEFT HAND

// Exporting animations from Zidane's usual model to be used by Zidane's Pluto model
BoneHierarchy:
bone000
bone000/bone014
bone000/bone014/bone022
bone000/bone014/bone022/bone023
bone000/bone014/bone022/bone023/bone024
bone000/bone014/bone022/bone023/bone024/bone025
bone000/bone014/bone022/bone023/bone024/bone025/bone026
bone000/bone014/bone020
bone000/bone014/bone020/bone021
bone000/bone014/bone015
bone000/bone014/bone015/bone016
bone000/bone014/bone015/bone016/bone017
bone000/bone014/bone015/bone016/bone017/bone018
bone000/bone014/bone015/bone016/bone017/bone018/bone019
bone000/bone001
bone000/bone001/bone010
bone000/bone001/bone010/bone011
bone000/bone001/bone010/bone011/bone012
bone000/bone001/bone010/bone011/bone012/bone013
bone000/bone001/bone006
bone000/bone001/bone006/bone007
bone000/bone001/bone006/bone007/bone008
bone000/bone001/bone006/bone007/bone008/bone009
bone000/bone001/bone002
bone000/bone001/bone002/bone003
bone000/bone001/bone002/bone003/bone004
bone000/bone001/bone002/bone003/bone004/bone005

= Animations for Garnet (Hooded) =
// Garnet's bone hierarchy (Hooded model)
bone000
bone000/bone001
bone000/bone001/bone002
bone000/bone001/bone003
bone000/bone001/bone003/bone004
bone000/bone001/bone003/bone005
bone000/bone001/bone003/bone005/bone006
bone000/bone001/bone003/bone005/bone006/bone007				RIGHT FOOT
bone000/bone001/bone008
bone000/bone001/bone008/bone009
bone000/bone001/bone008/bone010
bone000/bone001/bone008/bone010/bone011
bone000/bone001/bone008/bone010/bone011/bone012				LEFT FOOT
bone000/bone013
bone000/bone013/bone014
bone000/bone013/bone014/bone015
bone000/bone013/bone014/bone015/bone016
bone000/bone013/bone014/bone015/bone016/bone017
bone000/bone013/bone014/bone015/bone016/bone017/bone018		RIGHT HAND
bone000/bone013/bone019
bone000/bone013/bone019/bone020								PENDANT
bone000/bone013/bone021
bone000/bone013/bone021/bone022
bone000/bone013/bone021/bone022/bone023						HEAD
bone000/bone013/bone021/bone022/bone023/bone024
bone000/bone013/bone021/bone022/bone023/bone024/bone025		HEAD (hood)
bone000/bone013/bone021/bone022/bone023/bone024/bone026		HEAD (hood)
bone000/bone013/bone027
bone000/bone013/bone027/bone028
bone000/bone013/bone027/bone028/bone029
bone000/bone013/bone027/bone028/bone029/bone030
bone000/bone013/bone027/bone028/bone029/bone030/bone031		LEFT HAND

// Exporting animations from Garnet's usual model to be used by Garnet's hooded model
BoneHierarchy:
bone000
bone000/bone001
bone000/bone001/bone003
bone000/bone001/bone003/bone005
bone000/bone001/bone003/bone005/bone006
bone000/bone001/bone003/bone005/bone006/bone007
bone000/bone001/bone008
bone000/bone001/bone008/bone010
bone000/bone001/bone008/bone010/bone011
bone000/bone001/bone008/bone010/bone011/bone012
bone000/bone013
bone000/bone013/bone014
bone000/bone013/bone014/bone015
bone000/bone013/bone014/bone015/bone016
bone000/bone013/bone014/bone015/bone016/bone017
bone000/bone013/bone014/bone015/bone016/bone017/bone018
bone000/bone013/bone019
bone000/bone013/bone019/bone020
bone000/bone013/bone021
bone000/bone013/bone021/bone022
bone000/bone013/bone021/bone022/bone023


bone000/bone013/bone027
bone000/bone013/bone027/bone028
bone000/bone013/bone027/bone028/bone029
bone000/bone013/bone027/bone028/bone029/bone030
bone000/bone013/bone027/bone028/bone029/bone030/bone031




INFOS:
------

This mod has been made mainly with the tools Hades Workshop and Memoria.
Hades Workshop is available on Qhimm's forum for instance: http://forums.qhimm.com/index.php?topic=14315.0
Memoria is available on Github: https://github.com/Albeoris/Memoria/releases

You can contact Tirlititi either via Discord Moogles & Mods, forums.qhimm.com or at steamcommunity.com
You can contact WarpedEdge via Discord Moogles & Mods
Since it changes assets different than most other mods, this mod is compatible with them (eg. Moguri, Alternate Fantasy, PSX buttons...).

Thanks to the developers of Memoria, especially Albeoris.

Have fun!


