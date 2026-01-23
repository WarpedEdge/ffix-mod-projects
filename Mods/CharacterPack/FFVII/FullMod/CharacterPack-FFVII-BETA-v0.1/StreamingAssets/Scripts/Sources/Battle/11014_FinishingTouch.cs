using System;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Finishing Touch: magic attack hitting all enemies.
    /// Applies Bad Breath-style statuses plus Float, and has a chance to instantly kill normal enemies.
    /// Ability data must point to script 11014.
    /// </summary>
    [BattleScript(Id)]
    public sealed class FinishingTouchScript : IBattleScript
    {
        public const Int32 Id = 11014;

        private const BattleStatus FinishingTouchStatuses =
            BattleStatus.Confuse |
            BattleStatus.Blind |
            BattleStatus.Poison |
            BattleStatus.Slow |
            BattleStatus.Mini |
            BattleStatus.Float;

        private readonly BattleCalculator _v;

        public FinishingTouchScript(BattleCalculator v)
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
                ApplyStatuses();
                TryInstantKill();
            }
        }

        private void ApplyStatuses()
        {
            if (_v.Target == null || !_v.Target.IsTargetable)
                return;

            _v.Target.TryAlterStatuses(FinishingTouchStatuses, false, _v.Caster);
        }

        private void TryInstantKill()
        {
            if (_v.Target == null || !_v.Target.IsTargetable)
                return;
            if (_v.Target.IsPlayer)
                return;
            if (!_v.Target.CanBeAttacked())
                return;

            Int32 chance = Math.Max(0, Math.Min(100, _v.Command.HitRate));
            if (GameRandom.Next16() % 100 < chance)
                _v.Target.Kill(_v.Caster);
        }
    }
}
