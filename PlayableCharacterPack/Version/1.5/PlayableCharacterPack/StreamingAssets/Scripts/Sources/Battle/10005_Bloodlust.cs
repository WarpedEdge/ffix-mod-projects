using System;
using System.Collections.Generic;
using Memoria;
using Memoria.Data;
using FF9;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Bloodlust: temporary Berserk that adds lifesteal
    /// </summary>
    [BattleScript(Id)]
    public sealed class BloodlustScript : IBattleScript
    {
        public const Int32 Id = 10005;
		
        private readonly BattleCalculator _v;

        public BloodlustScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			UInt32 addBerserk = btl_stat.AlterStatus(_v.Target, BattleStatusId.Berserk, _v.Caster);
			if (addBerserk == btl_stat.ALTER_RESIST)
			{
				_v.Context.Flags |= BattleCalcFlags.Guard;
				return;
			}
			if (addBerserk == btl_stat.ALTER_INVALID)
			{
				_v.Context.Flags |= BattleCalcFlags.Miss;
				return;
			}
			Int32 turnCounter = _v.Command.HitRate;
			Boolean wasAttacking = false;
			_v.Target.AddDelayedModifier(
				target =>
				{
					if (!target.IsUnderAnyStatus(BattleStatus.Berserk))
						return false;
					Boolean isAttacking = btl_util.IsBtlUsingCommand(target, out CMD_DATA cmd) && cmd.cmd_no == BattleCommandId.Attack;
					if (isAttacking)
						cmd.AbilityCategory |= 32; // Use the dummied category "Short" to flag the drain effect (coded in AbilityFeatures.txt)
					if (!isAttacking && wasAttacking)
						turnCounter--;
					wasAttacking = isAttacking;
					return turnCounter > 0;
				},
				target =>
				{
					btl_stat.RemoveStatus(target, BattleStatusId.Berserk);
				}
			);
        }
    }
}
