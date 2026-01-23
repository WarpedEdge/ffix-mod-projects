using Memoria.Data;
using System;

namespace Memoria.Scripts.Battle
{
    [BattleScript(Id)]
    public sealed class DeathblowScript : IBattleScript
    {
        public const Int32 Id = 11000;

        private readonly BattleCalculator _v;

        public DeathblowScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            // Run the normal accuracy check first.
            _v.PhysicalAccuracy();
            if (!_v.TryPhysicalHit())
                return;

            // Force an extra 50% miss chance.
            if (GameRandom.Next16() % 100 >= 50)
            {
                _v.Context.Flags |= BattleCalcFlags.Miss;
                return;
            }

            // Usual physical setup.
            _v.WeaponPhysicalParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            _v.BonusElement();

            if (!_v.CanAttackWeaponElementalCommand())
                return;

            // Treat as “critical”: double the attack and apply damage.
            _v.Context.Attack *= 2;
            _v.Target.Flags |= CalcFlag.Critical;
            _v.CalcHpDamage();
            _v.TryAlterMagicStatuses();
        }
    }
}
