using Memoria.Data;
using System;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Gwahaha: a physical attack that always deals critical damage (Baku's attack SFX make him miss randomly)
    /// </summary>
    [BattleScript(Id)]
    public sealed class GwahahaScript : IBattleScript
    {
        public const Int32 Id = 10013;

        private readonly BattleCalculator _v;

        public GwahahaScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			// Based on PhysicalAttackScript (19)
            _v.WeaponPhysicalParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            _v.BonusElement();
            if (_v.CanAttackWeaponElementalCommand())
            {
                _v.Context.Attack *= 2;
                _v.Target.Flags |= CalcFlag.Critical;
                _v.CalcHpDamage();
                _v.TryAlterMagicStatuses();
            }
        }
    }
}
