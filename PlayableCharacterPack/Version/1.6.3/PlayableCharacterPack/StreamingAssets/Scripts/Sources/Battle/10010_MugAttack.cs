using Memoria.Data;
using System;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Mug: perform both a "Steal" and an "Attack" command simultaneously
    /// </summary>
    [BattleScript(Id)]
    public sealed class MugAttackScript : IBattleScript
    {
        public const Int32 Id = 10010;

        private readonly BattleCalculator _v;

        public MugAttackScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            MutableBattleCommand commandSteal = new MutableBattleCommand(_v.Caster, _v.Target.Id, _v.Command.Id, _v.Command.AbilityId);
            commandSteal.ScriptId = 58; // StealScript.Id
            SBattleCalculator.CalcMain(_v.Caster, _v.Target, commandSteal);
			if (_v.Caster.Data.weapon != null)
			{
				MutableBattleCommand commandAttack = new MutableBattleCommand(_v.Caster, _v.Target.Id, _v.Command.Id, BattleAbilityId.Attack);
				commandAttack.ScriptId = _v.Caster.Data.weapon.Ref.ScriptId;
				SBattleCalculator.CalcMain(_v.Caster, _v.Target, commandAttack);
			}
            _v.PerformCalcResult = false;
        }
    }
}
