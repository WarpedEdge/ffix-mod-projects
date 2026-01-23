using System;
using Memoria.Data;

namespace Memoria.Scripts.Overloads
{
    // Keeps Cloud's Punisher stance bonuses in one place so we don't have to patch every ability by hand.
    public sealed class CloudModeDamageModifier : IOverloadDamageModifierScript
    {
        private const Int32 CloudIndex = 50;
        private const BattleAbilityId PrimeModeAbilityId = (BattleAbilityId)11074;

        public void OnDamageModifierChange(BattleCalculator v, Int32 previousValue, Int32 bonus)
        {
            // Not used for Cloud right now; nothing special happens when the base damage number shifts mid-calc.
        }

        public void OnDamageDrasticReduction(BattleCalculator v)
        {
            // We do not need the drastic reduction hook either, but the interface requires the method.
        }

        public void OnDamageFinalChanges(BattleCalculator v)
        {
            // Stop if the calculator did not come through; nothing to tweak in that case.
            if (v == null)
                return;

            // These flags let us check who is swinging and which stance Cloud is sitting in.
            Boolean casterIsCloudPunisher = v.Caster != null && (Int32)v.Caster.PlayerIndex == CloudIndex && v.Caster.IsUnderAnyStatus(BattleStatus.CustomStatus26);
            Boolean casterIsCloudPrime = v.Caster != null && (Int32)v.Caster.PlayerIndex == CloudIndex && v.Caster.IsUnderAnyStatus(BattleStatus.CustomStatus28);
            Boolean targetIsCloudPunisher = v.Target != null && (Int32)v.Target.PlayerIndex == CloudIndex && v.Target.IsUnderAnyStatus(BattleStatus.CustomStatus26);
            Boolean targetIsCloudPrime = v.Target != null && (Int32)v.Target.PlayerIndex == CloudIndex && v.Target.IsUnderAnyStatus(BattleStatus.CustomStatus28);
            Boolean isPhysical = v.Command != null && (v.Command.AbilityCategory & 8) != 0;

            if (casterIsCloudPunisher)
            {
                // Punisher Cloud deals 25% extra damage on both HP and MP hits.
                if ((v.Target.Flags & CalcFlag.HpAlteration) != 0)
                    v.Target.HpDamage = (Int32)Math.Round(v.Target.HpDamage * 1.25f);
                if ((v.Target.Flags & CalcFlag.MpAlteration) != 0)
                    v.Target.MpDamage = (Int32)Math.Round(v.Target.MpDamage * 1.25f);
            }

            if (targetIsCloudPunisher && isPhysical && (v.Target.Flags & CalcFlag.HpAlteration) != 0)
            {
                // Punisher Cloud takes 50% more damage from incoming physical blows.
                v.Target.HpDamage = (Int32)Math.Round(v.Target.HpDamage * 1.5f);
            }

            if (casterIsCloudPrime)
            {
                // Prime Mode damage bonus: ability Power is percent bonus (e.g., 50 => +50%).
                Int32 primePower = GetAbilityPower(PrimeModeAbilityId);
                Single multiplier = 1f + Math.Max(0, primePower) / 100f;
                if ((v.Target.Flags & CalcFlag.HpAlteration) != 0)
                    v.Target.HpDamage = (Int32)Math.Round(v.Target.HpDamage * multiplier);
                if ((v.Target.Flags & CalcFlag.MpAlteration) != 0)
                    v.Target.MpDamage = (Int32)Math.Round(v.Target.MpDamage * multiplier);
            }

            if (targetIsCloudPrime && isPhysical && (v.Target.Flags & CalcFlag.HpAlteration) != 0)
            {
                // Prime Mode risk: ability HitRate is percent damage taken (e.g., 50 => +50% taken).
                Int32 primeRate = GetAbilityHitRate(PrimeModeAbilityId);
                Single multiplier = 1f + Math.Max(0, primeRate) / 100f;
                v.Target.HpDamage = (Int32)Math.Round(v.Target.HpDamage * multiplier);
            }

            // Counterstance guard handling lives in CloudCounterstanceGuardScript to avoid duplicate guard popups.
        }

        private static Int32 GetAbilityPower(BattleAbilityId abilityId)
        {
            if (FF9BattleDB.CharacterActions.TryGetValue(abilityId, out AA_DATA data))
                return data.Ref.Power;
            return 0;
        }

        private static Int32 GetAbilityHitRate(BattleAbilityId abilityId)
        {
            if (FF9BattleDB.CharacterActions.TryGetValue(abilityId, out AA_DATA data))
                return data.Ref.Rate;
            return 0;
        }
    }
}
