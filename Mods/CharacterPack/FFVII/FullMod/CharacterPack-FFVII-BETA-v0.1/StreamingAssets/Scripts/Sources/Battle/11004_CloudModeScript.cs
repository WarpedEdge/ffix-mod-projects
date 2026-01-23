using System;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Handles Operator Mode (11068) and Punisher Mode (11069) stance toggles.
    /// </summary>
    [BattleScript(Id)]
    public sealed class CloudModeModeScript : IBattleScript
    {
        public const Int32 Id = 11004;

        private readonly BattleCalculator _v;

        public CloudModeModeScript(BattleCalculator v)
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

            BattleAbilityId abilityId = _v.Command.AbilityId;
            if (abilityId == (BattleAbilityId)11069)
            {
                caster.RemoveStatus(BattleStatus.CustomStatus25);
                caster.RemoveStatus(BattleStatus.CustomStatus27);
                caster.RemoveStatus(BattleStatus.CustomStatus28);
                caster.RemoveStatus(BattleStatus.Defend);
                caster.AlterStatus(BattleStatus.CustomStatus26, caster);
            }
            else if (abilityId == (BattleAbilityId)11068)
            {
                caster.RemoveStatus(BattleStatus.CustomStatus26);
                caster.RemoveStatus(BattleStatus.CustomStatus27);
                caster.RemoveStatus(BattleStatus.CustomStatus28);
                caster.RemoveStatus(BattleStatus.Defend);
                caster.AlterStatus(BattleStatus.CustomStatus25, caster);
            }
        }
    }
}
