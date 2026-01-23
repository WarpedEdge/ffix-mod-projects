using System;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Primed Attack – physical attack that exits Prime Mode into Operator.
    /// Ability data must point to script 11009.
    /// </summary>
    [BattleScript(Id)]
    public sealed class PrimedAttackScript : IBattleScript
    {
        public const Int32 Id = 11009;

        private readonly BattleCalculator _v;

        public PrimedAttackScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            if (_v.Target == null || !_v.Target.IsTargetable)
            {
                RevertToOperator();
                return;
            }

            _v.PhysicalAccuracy();
            if (_v.TryPhysicalHit())
            {
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
            if ((Int32)caster.PlayerIndex != 50)
                return;

            caster.RemoveStatus(BattleStatus.CustomStatus27);
            caster.RemoveStatus(BattleStatus.CustomStatus28);
            caster.RemoveStatus(BattleStatus.Defend);
            // If SA12091 is equipped Primed Attack will go back to Punisher Mode rather than Operator Mode
            if (caster.HasSupportAbilityByIndex((SupportAbility)12091))
            {
                caster.RemoveStatus(BattleStatus.CustomStatus25);
                caster.AlterStatus(BattleStatus.CustomStatus26, caster);
            }
            else
            {
                caster.RemoveStatus(BattleStatus.CustomStatus26);
                caster.AlterStatus(BattleStatus.CustomStatus25, caster);
            }
        }
    }
}
