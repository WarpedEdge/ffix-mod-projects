using Memoria.Data;
using System;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Headbutt: a physical attack that harms the caster and lowers the target's physical defence (after damage)
    /// </summary>
    [BattleScript(Id)]
    public sealed class HeadbuttScript : IBattleScript
    {
        public const Int32 Id = 10014;

        private readonly BattleCalculator _v;

        public HeadbuttScript(BattleCalculator v)
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
            if (!_v.CanAttackElementalCommand())
                return;
            _v.CalcHpDamage();
			
			// Damage self, based on the attack's hit rate and the caster's Max HP
            _v.Caster.HpDamage = (Int32)(_v.Caster.MaximumHp * _v.Command.HitRate / 100);
			if (_v.Caster.HpDamage > 0)
				_v.Caster.Flags |= CalcFlag.HpAlteration;
			
			// Lower physical defence to 75%
			_v.Target.TryAlterSingleStatus(BattleStatusId.ChangeStat, false, _v.Caster, "PhysicalDefence", _v.Target.PhysicalDefence * 3 / 4);
        }
    }
}
