using System;
using System.Collections.Generic;
using Assets.Sources.Scripts.UI.Common;
using Memoria;
using Memoria.Data;
using Memoria.Assets;
using FF9;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Grenades: throwing a damaging item
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
			RegularItem grenade = _v.Command.ItemId;
			if (grenade == RegularItem.NoItem || !ff9item.HasItemWeapon(grenade))
			{
				_v.Context.Flags |= BattleCalcFlags.Miss;
				return;
			}
			BattleItem grenadeEffect = BattleItem.Find(grenade);
			Weapon grenadeWeapon = ff9item.HasItemEffect(grenade) ? Weapon.Find(grenade) : null;
			Int32 secondaryPower = grenadeWeapon != null ? grenadeWeapon.Power : 0;
			if (grenadeEffect.Power > 0 || secondaryPower > 0)
			{
				// Damaging grenade (with potential status ailment)
				_v.Context.Attack = (grenadeEffect.Power + GameRandom.RandomInt(0, secondaryPower + 1)) * _v.Command.Power / 100;
				_v.Context.AttackPower = 1;
				_v.Context.DefensePower = 0;
				if (_v.ApplyElementFullStack(grenadeWeapon != null ? grenadeWeapon.Element : 0, grenadeWeapon != null ? grenadeWeapon.Element : 0))
				{
					_v.CalcDamageCommon();
					_v.Target.HpDamage = _v.Context.Attack;
					if (grenadeEffect.HitRate > GameRandom.RandomInt(0, 100))
						_v.Target.TryAlterStatuses(grenadeEffect.Status, false, _v.Caster);
				}
			}
			else
			{
				// Status-inflicting grenade with no damage
				if (grenadeEffect.HitRate > GameRandom.RandomInt(0, 100))
					_v.Target.TryAlterStatuses(grenadeEffect.Status, true, _v.Caster);
				else
					_v.Context.Flags |= BattleCalcFlags.Miss;
			}
			
			// Progress learning of Grenade-related abilities
			if (_v.Caster.IsPlayer)
			{
				PLAYER player = _v.Caster.Player;
				foreach (SupportAbility saId in new[]{ (SupportAbility)10007, (SupportAbility)10008 })
				{
					Int32 saAbsoluteId = ff9abil.GetAbilityIdFromSupportAbility(saId);
					Int32 curAp = ff9abil.FF9Abil_GetAp(player, saAbsoluteId);
					if (curAp >= 0 && curAp < ff9abil.FF9Abil_GetMax(player, saAbsoluteId))
					{
						ff9abil.FF9Abil_SetAp(player, saAbsoluteId, curAp + 1);
						if (ff9abil.FF9Abil_IsMaster(player, saAbsoluteId))
							btl2d.Btl2dReqSymbolMessage(_v.Caster, "[00FFFF]", BattleHUD.FormatLearnAbilityMessage(FF9TextTool.SupportAbilityName(saId)), HUDMessage.MessageStyle.DAMAGE, 12);
					}
				}
			}
        }
    }
}
