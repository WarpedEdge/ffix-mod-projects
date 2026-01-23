using System;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Prime Mode – switches Cloud from Punisher to Prime stance.
    /// Ability data must point to script 11008.
    /// </summary>
    [BattleScript(Id)]
    public sealed class PrimeModeScript : IBattleScript
    {
        public const Int32 Id = 11008;

        private readonly BattleCalculator _v;

        public PrimeModeScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.PerformCalcResult = false;

            BattleUnit caster = _v.Caster;
            if (caster == null)
                return;
            if ((Int32)caster.PlayerIndex != 50)
                return;

            caster.RemoveStatus(BattleStatus.CustomStatus25);
            caster.RemoveStatus(BattleStatus.CustomStatus26);
            caster.RemoveStatus(BattleStatus.CustomStatus27);
            caster.RemoveStatus(BattleStatus.Defend);
            caster.AlterStatus(BattleStatus.CustomStatus28, caster);
        }
    }
}
