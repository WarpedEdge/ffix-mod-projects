using System;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Counterstrike triggered by Counterstance. Guarantees a hit and reverts Cloud to Operator mode afterwards.
    /// </summary>
    [BattleScript(Id)]
    public sealed class CounterstanceStrikeScript : IBattleScript
    {
        public const Int32 Id = 11006;

        private readonly BattleCalculator _v;

        public CounterstanceStrikeScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            // Land the counter without worrying about Cloud's current accuracy/evasion.
            _v.PhysicalAccuracy();
            _v.Context.HitRate = 255;
            _v.Context.Evade = 0;

            if (_v.TryPhysicalHit())
            {
                // Reuse the normal physical pipeline so weapon buffs and elements still count.
                _v.WeaponPhysicalParams();
                _v.Caster.EnemyTranceBonusAttack();
                _v.Caster.PhysicalPenaltyAndBonusAttack();
                _v.Target.PhysicalPenaltyAndBonusAttack();
                _v.BonusElement();

                if (_v.CanAttackWeaponElementalCommand())
                {
                    _v.CalcHpDamage();
                    _v.TryAlterMagicStatuses();
                }
            }

            RevertToOperator();
        }

        private void RevertToOperator()
        {
            BattleUnit caster = _v.Caster;
            if (caster == null)
                return;

            // Safety net: another character should never land here, but skip just in case.
            if ((Int32)caster.PlayerIndex != 50)
                return;

            // Drop back to the safe stance once the counter fires.
            caster.RemoveStatus(BattleStatus.CustomStatus26);
            caster.RemoveStatus(BattleStatus.CustomStatus27);
            caster.RemoveStatus(BattleStatus.Defend);
            caster.AlterStatus(BattleStatus.CustomStatus25, caster);
        }
    }
}
