# List of animation strings
animation_list = [
    "3DModelAnimation 20848 ANH_SUB_F0_SSB_BTL_IDLE",
    "3DModelAnimation 25428 ANH_SUB_F0_SSB_BTL_IDLEWEAK",
    "3DModelAnimation 20842 ANH_SUB_F0_SSB_BTL_HIT",
    "3DModelAnimation 20856 ANH_SUB_F0_SSB_BTL_HITSTRONG",
    "3DModelAnimation 25443 ANH_SUB_F0_SSB_BTL_IDLEKO",
    "3DModelAnimation 25464 ANH_SUB_F0_SSB_BTL_WEAK_STAND",
    "3DModelAnimation 25430 ANH_SUB_F0_SSB_BTL_KO_WEAK",
    "3DModelAnimation 25432 ANH_SUB_F0_SSB_BTL_STAND_WEAK",
    "3DModelAnimation 25441 ANH_SUB_F0_SSB_BTL_WEAK_KO",
    "3DModelAnimation 25490 ANH_SUB_F0_SSB_BTL_IDLEREADY",
    "3DModelAnimation 25488 ANH_SUB_F0_SSB_BTL_STAND_READY",
    "3DModelAnimation 25486 ANH_SUB_F0_SSB_BTL_WEAK_READY",
    "3DModelAnimation 25454 ANH_SUB_F0_SSB_BTL_READY_DEFEND",
    "3DModelAnimation 25482 ANH_SUB_F0_SSB_BTL_IDLEDEFEND",
    "3DModelAnimation 25424 ANH_SUB_F0_SSB_BTL_DEFEND_STAND",
    "3DModelAnimation 25456 ANH_SUB_F0_SSB_BTL_COVER",
    "3DModelAnimation 25450 ANH_SUB_F0_SSB_BTL_DODGE",
    "3DModelAnimation 22201 ANH_SUB_F0_SSB_BTL_FLEE",
    "3DModelAnimation 25448 ANH_SUB_F0_SSB_BTL_VICTORY",
    "3DModelAnimation 25480 ANH_SUB_F0_SSB_BTL_VICTORYLOOP",
    "3DModelAnimation 25458 ANH_SUB_F0_SSB_BTL_READY_ATTACK",
    "3DModelAnimation 20850 ANH_SUB_F0_SSB_BTL_ATTACKRUN",
    "3DModelAnimation 20855 ANH_SUB_F0_SSB_BTL_ATTACK1",
    "3DModelAnimation 20840 ANH_SUB_F0_SSB_BTL_ATTACK2",
    "3DModelAnimation 20844 ANH_SUB_F0_SSB_BTL_JUMPBACK1",
    "3DModelAnimation 20859 ANH_SUB_F0_SSB_BTL_JUMPBACK2",
    "3DModelAnimation 20846 ANH_SUB_F0_SSB_BTL_READY_CAST",
    "3DModelAnimation 20852 ANH_SUB_F0_SSB_BTL_IDLE_CAST",
    "3DModelAnimation 20836 ANH_SUB_F0_SSB_BTL_CAST_STAND",
    "3DModelAnimation 25460 ANH_SUB_F0_SSB_BTL_MOVEFORWARD",
    "3DModelAnimation 25462 ANH_SUB_F0_SSB_BTL_MOVEBACKWARD",
    "3DModelAnimation 25478 ANH_SUB_F0_SSB_BTL_ITEM",
    "3DModelAnimation 25468 ANH_SUB_F0_SSB_BTL_READY_STAND",
    "3DModelAnimation 25474 ANH_SUB_F0_SSB_BTL_SPECIAL_CAST"
]

# Loop through the list and create a .txt file for each BTL_*** entry
for animation in animation_list:
    # Find the index of 'BTL_'
    start_index = animation.find('BTL_')
    if start_index != -1:
        # Extract everything after 'BTL_'
        btl_part = animation[start_index:]
        
        # Create a .txt file with the extracted name
        with open(f"{btl_part}.txt", 'w') as file:
            file.write("")

print("Files created successfully.")
