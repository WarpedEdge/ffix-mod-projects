using System;
using System.Collections.Generic;
using Memoria;
using Memoria.Data;
using FF9;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Tactical Retreat: flee individually
    /// </summary>
    [BattleScript(Id)]
    public sealed class SingleFleeScript : IBattleScript
    {
        public const Int32 Id = 10007;
		
        private readonly BattleCalculator _v;

        public SingleFleeScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            if (!FF9StateSystem.Battle.FF9Battle.btl_scene.Info.Runaway || _v.Target.IsUnderAnyStatus(BattleStatusConst.CannotEscape))
			{
                UIManager.Battle.SetBattleFollowMessage(BattleMesages.CannotEscape);
                return;
			}
			FF9StateSystem.Battle.FF9Battle.btl_scene.Info.NoGameOver = true;
			_v.Target.Remove();
        }
    }
}
