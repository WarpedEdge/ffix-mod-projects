using Memoria.Data;
using System;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Cheer: heal HP depending on the target's Spirit / caster's Level, and increase the Trance gauge
    /// </summary>
    [BattleScript(Id)]
    public sealed class CheerScript : IBattleScript
    {
        public const Int32 Id = 10012;

        private readonly BattleCalculator _v;

        public CheerScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			_v.Context.AttackPower = _v.Target.Will * (_v.Caster.Level + GameRandom.RandomInt(0, _v.Caster.Level)) * _v.Command.Power / 100;
			_v.Context.DefensePower = 0;
			_v.Context.Attack = 1;
            _v.Caster.PenaltyMini();
            _v.PenaltyCommandDividedAttack();
            _v.CalcHpMagicRecovery();
			if ((_v.Context.Flags & BattleCalcFlags.Miss) == 0 && _v.Target.HasTrance && !_v.Target.IsUnderAnyStatus(BattleStatus.Trance))
			{
				Int32 tranceIncrease = _v.Target.Will * _v.Command.HitRate / 100;
				if (_v.Target.HasSupportAbilityByIndex(SupportAbility.HighTide))
					tranceIncrease += tranceIncrease / 2;
				_v.Target.Trance = (Byte)Math.Min(255, _v.Target.Trance + tranceIncrease);
			}
        }
    }
}
