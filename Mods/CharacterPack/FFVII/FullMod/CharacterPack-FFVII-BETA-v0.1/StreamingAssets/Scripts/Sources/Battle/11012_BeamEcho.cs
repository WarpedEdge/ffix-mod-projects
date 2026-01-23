using System;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Blade Beam follow-up: Magic AOE hit without reapplying Blade Echo.
    /// Triggered by the Beam Echo status when an enemy finishes its turn.
    /// </summary>
    [BattleScript(Id)]
    public sealed class BladeBeamFollowupScript : IBattleScript
    {
        public const Int32 Id = 11012;

        private readonly BattleCalculator _v;

        public BladeBeamFollowupScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.OriginalMagicParams();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PenaltyMini();
            _v.Target.PenaltyShellAttack();
            _v.BonusElement();

            if (_v.CanAttackMagic())
            {
                _v.CalcHpDamage();
                _v.TryAlterMagicStatuses();
            }
        }
    }
}
