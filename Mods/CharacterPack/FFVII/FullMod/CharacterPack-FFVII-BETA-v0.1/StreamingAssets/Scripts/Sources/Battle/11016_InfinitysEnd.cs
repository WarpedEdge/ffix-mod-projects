using System;
using System.Collections.Generic;
using System.Linq;
using FF9;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Infinity's End: strong physical attack with adjacent splash (half damage).
    /// Damage limit break is handled by AbilityFeatures.
    /// Ability data must point to script 11016.
    /// </summary>
    [BattleScript(Id)]
    public sealed class InfinitysEndScript : IBattleScript
    {
        public const Int32 Id = 11016;

        private readonly BattleCalculator _v;

        public InfinitysEndScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.PhysicalAccuracy();
            if (!_v.TryPhysicalHit())
                return;

            _v.WeaponPhysicalParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            _v.BonusElement();

            if (!_v.CanAttackWeaponElementalCommand())
                return;

            _v.CalcHpDamage();
            _v.TryAlterMagicStatuses();

            Int32 mainDamage = _v.Target.HpDamage;
            if (mainDamage <= 0)
                return;

            ApplyAdjacentSplit(mainDamage / 2);
        }

        private void ApplyAdjacentSplit(Int32 splitDamage)
        {
            if (splitDamage <= 0 || _v.Target == null)
                return;

            List<BattleUnit> sameSideUnits = BattleState.EnumerateUnits()
                .Where(unit => unit.IsPlayer == _v.Target.IsPlayer && unit.IsTargetable)
                .ToList();
            Int32 targetIndex = sameSideUnits.FindIndex(unit => unit.Id == _v.Target.Id);
            if (targetIndex < 0)
                return;

            ApplySplitDamage(GetUnitAt(sameSideUnits, targetIndex - 1), splitDamage);
            ApplySplitDamage(GetUnitAt(sameSideUnits, targetIndex + 1), splitDamage);
        }

        private static BattleUnit GetUnitAt(List<BattleUnit> units, Int32 index)
        {
            if (index < 0 || index >= units.Count)
                return null;
            return units[index];
        }

        private void ApplySplitDamage(BattleUnit target, Int32 damage)
        {
            if (target == null || !target.IsTargetable || damage <= 0)
                return;

            btl_para.SetDamage(target, damage, 0, _v.Command?.Data, requestFigureNow: true);
        }
    }
}
