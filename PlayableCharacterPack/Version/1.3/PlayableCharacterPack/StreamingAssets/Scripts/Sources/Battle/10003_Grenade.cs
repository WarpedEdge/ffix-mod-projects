using System;
using System.Collections.Generic;
using Memoria;
using Memoria.Data;
using FF9;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Grenade skills to remove 1 per use.
    /// </summary>
    [BattleScript(Id)]
    public sealed class GrenadeScript : IBattleScript
    {
        public const Int32 Id = 10003;

        private readonly BattleCalculator _v;

        public GrenadeScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            if (_v.Command.AbilityId == (BattleAbilityId)10034 || _v.Command.AbilityId == (BattleAbilityId)10043) // Grenade & Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10013);
            else if (_v.Command.AbilityId == (BattleAbilityId)10035 || _v.Command.AbilityId == (BattleAbilityId)10044) // Fire Grenade & Fire Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10014);
            else if (_v.Command.AbilityId == (BattleAbilityId)10036 || _v.Command.AbilityId == (BattleAbilityId)10045) // Ice Grenade & Ice Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10015);
            else if (_v.Command.AbilityId == (BattleAbilityId)10037 || _v.Command.AbilityId == (BattleAbilityId)10046) // Thunder Grenade & Thunder Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10016);
            else if (_v.Command.AbilityId == (BattleAbilityId)10038 || _v.Command.AbilityId == (BattleAbilityId)10047) // Earth Grenade & Earth Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10017);
            else if (_v.Command.AbilityId == (BattleAbilityId)10039 || _v.Command.AbilityId == (BattleAbilityId)10048) // Water Grenade & Water Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10018);
            else if (_v.Command.AbilityId == (BattleAbilityId)10040 || _v.Command.AbilityId == (BattleAbilityId)10049) // Wind Grenade & Wind Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10019);
            else if (_v.Command.AbilityId == (BattleAbilityId)10041 || _v.Command.AbilityId == (BattleAbilityId)10050) // Holy Grenade & Holy Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10020);
            else if (_v.Command.AbilityId == (BattleAbilityId)10042 || _v.Command.AbilityId == (BattleAbilityId)10051) // Shadow Grenade & Shadow Grenade+
                BattleItem.RemoveFromInventory((RegularItem)10021);
            else 
                Memoria.Prime.Log.Message($"[DEBUG] I am parsing correctly!");

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
