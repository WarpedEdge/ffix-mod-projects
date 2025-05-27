using Memoria.Data;
using System;

namespace Memoria.Scripts.Battle
{
    [BattleScript(Id)]
    public sealed class LeveledMagicAttackScript : IBattleScript, IEstimateBattleScript
    {
        public const Int32 Id = 10008;

        private readonly BattleCalculator _v;

        public LeveledMagicAttackScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.NormalMagicParams();
			_v.Context.AttackPower += _v.Caster.Level;
            _v.Caster.EnemyTranceBonusAttack();
            _v.Caster.PenaltyMini();
            _v.Target.PenaltyShellAttack();
            _v.PenaltyCommandDividedAttack();
            _v.BonusElement();

            if (_v.CanAttackMagic())
            {
                _v.CalcHpDamage();
                _v.TryAlterMagicStatuses();
            }
        }

        public Single RateTarget()
        {
            _v.NormalMagicParams();
			_v.Context.AttackPower += _v.Caster.Level;
            _v.Caster.PenaltyMini();
            _v.Target.PenaltyShellAttack();
            _v.PenaltyCommandDividedAttack();
            _v.BonusElement();

            if (!_v.CanAttackMagic())
                return 0;

            if (_v.Target.IsUnderAnyStatus(BattleStatusConst.ApplyReflect) && !_v.Command.IsReflectNull)
                return 0;

            _v.CalcHpDamage();

            Single rate = Math.Min(_v.Target.HpDamage, _v.Target.CurrentHp);

            if ((_v.Target.Flags & CalcFlag.HpRecovery) == CalcFlag.HpRecovery)
                rate *= -1;
            if (_v.Target.IsPlayer)
                rate *= -1;

            return rate;
        }
    }
}
