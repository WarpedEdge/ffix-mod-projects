using System;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Meteorain: magic attack with multi-hit SFX handled by ef11015.
    /// Ability data must point to script 11015.
    /// </summary>
    [BattleScript(Id)]
    public sealed class MeteorainScript : IBattleScript
    {
        public const Int32 Id = 11015;

        private readonly BattleCalculator _v;

        public MeteorainScript(BattleCalculator v)
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
