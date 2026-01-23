using System;
using Memoria;
using Memoria.Data;
using Assets.Sources.Scripts.UI.Common;
using FF9;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Disorder – standard sword slash that flips Cloud's stance afterwards.
    /// Ability data must point to script 11007.
    /// </summary>
    [BattleScript(Id)]
    public sealed class DisorderScript : IBattleScript
    {
        public const Int32 Id = 11007;

        private const String AtbGainPopupColor = "[6BFF6B]";
        private const String AtbGainMessage = "ATB Increased";
        private const Byte AtbGainPopupDelay = 8;
        private const HUDMessage.MessageStyle AtbPopupStyle = HUDMessage.MessageStyle.DAMAGE;

        private readonly BattleCalculator _v;

        public DisorderScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            // Run the physical attack script 19.
            ExecutePhysicalAttack();

            BattleUnit caster = _v.Caster;
            if (caster == null)
                return;

            // Only Cloud uses these stances, so skip the rest if something went wrong.
            if ((Int32)caster.PlayerIndex != 50)
                return;

            Boolean startedInPunisher = caster.IsUnderAnyStatus(BattleStatus.CustomStatus26);
            Boolean startedInOperator = caster.IsUnderAnyStatus(BattleStatus.CustomStatus25);

            // Flip to the opposite stance after the swing resolves.
            ToggleCloudMode(caster, startedInOperator, startedInPunisher);

            // Apply stance-specific ATB rewards once the swap is done.
            ApplyStanceAtbEffects(caster, startedInOperator, startedInPunisher);
        }

        private Boolean ExecutePhysicalAttack()
        {
            _v.PhysicalAccuracy();
            Boolean hit = _v.TryPhysicalHit();
            if (!hit)
                return false;

            _v.WeaponPhysicalParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            _v.BonusElement();

            if (!_v.CanAttackWeaponElementalCommand())
                return false;

            _v.CalcHpDamage();
            _v.TryAlterMagicStatuses();
            return true;
        }

        private void ToggleCloudMode(BattleUnit caster, Boolean wasOperator, Boolean wasPunisher)
        {
            if (wasPunisher)
            {
                // Punisher -> Operator
                caster.RemoveStatus(BattleStatus.CustomStatus26);
                caster.RemoveStatus(BattleStatus.CustomStatus27);
                caster.RemoveStatus(BattleStatus.CustomStatus28);
                caster.RemoveStatus(BattleStatus.Defend);
                caster.AlterStatus(BattleStatus.CustomStatus25, caster);
            }
            else if (wasOperator)
            {
                // Operator -> Punisher
                caster.RemoveStatus(BattleStatus.CustomStatus25);
                caster.RemoveStatus(BattleStatus.CustomStatus27);
                caster.RemoveStatus(BattleStatus.CustomStatus28);
                caster.RemoveStatus(BattleStatus.Defend);
                caster.AlterStatus(BattleStatus.CustomStatus26, caster);
            }
            else
            {
                // Safety: fall back to Operator if somehow neither stance was set.
                caster.RemoveStatus(BattleStatus.CustomStatus26);
                caster.RemoveStatus(BattleStatus.CustomStatus27);
                caster.RemoveStatus(BattleStatus.CustomStatus28);
                caster.RemoveStatus(BattleStatus.Defend);
                caster.AlterStatus(BattleStatus.CustomStatus25, caster);
            }
        }

        private void ApplyStanceAtbEffects(BattleUnit caster, Boolean startedInOperator, Boolean startedInPunisher)
        {
            // Punisher usage refunds Cloud's gauge after swapping back to Operator.
            if (startedInPunisher)
            {
                QueueCasterAtbRefund(caster);
            }
            // Operator usage swaps to Punisher and immediately arms Counterstance.
            else if (startedInOperator)
            {
                EnterCounterstance(caster);
            }
        }

        private void QueueCasterAtbRefund(BattleUnit caster)
        {
            if (caster == null)
                return;

            caster.AddDelayedModifier(
                unit => unit.CurrentAtb >= unit.MaximumAtb,
                unit =>
                {
                    if (unit.IsUnderAnyStatus(BattleStatusConst.StopAtb))
                        return;

                    Int32 maxAtb = unit.MaximumAtb;
                    if (maxAtb <= 0)
                        return;

                    Int32 refund = maxAtb / 2; // 50% refund of the new stance's bar.
                    Int32 after = Math.Min(maxAtb, unit.CurrentAtb + refund);

                    unit.CurrentAtb = (Int16)after;
                    if (unit.Data != null)
                        btl2d.Btl2dReqSymbolMessage(unit.Data, AtbGainPopupColor, AtbGainMessage, AtbPopupStyle, AtbGainPopupDelay);
                }
            );
        }

        private void EnterCounterstance(BattleUnit caster)
        {
            if (caster == null)
                return;

            // Mirror the Counterstance ability: defend posture + ready flag.
            caster.AlterStatus(BattleStatus.Defend, caster);
            caster.RemoveStatus(BattleStatus.CustomStatus27);
            caster.AlterStatus(BattleStatus.CustomStatus27, caster);
        }
    }
}
