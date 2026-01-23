using System;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Applies the Counterstance ready status (CustomStatus27) and defend posture.
    /// Think of it as hitting “guard” and waiting for the next swing so the follow-up script can react.
    /// </summary>
    [BattleScript(Id)]
    public sealed class CounterstanceReadyScript : IBattleScript
    {
        public const Int32 Id = 11005;

        private readonly BattleCalculator _v;

        public CounterstanceReadyScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.PerformCalcResult = false;

            BattleUnit caster = _v.Caster;
            if (caster == null)
                return;

            // Only Cloud should ever reach the custom stance logic; everyone else just Defends normally.
            if ((Int32)caster.PlayerIndex != 50)
            {
                caster.AlterStatus(BattleStatus.Defend, caster);
                return;
            }

            // Put Cloud in a guard pose and mark him as waiting for the counter follow-up.
            caster.AlterStatus(BattleStatus.Defend, caster);
            caster.RemoveStatus(BattleStatus.CustomStatus27);
            caster.AlterStatus(BattleStatus.CustomStatus27, caster);
        }
    }
}
