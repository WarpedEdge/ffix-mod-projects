using System;
using System.Collections.Generic;
using Memoria.Data;
using FF9;

namespace Memoria.Scripts.Battle
{
    [BattleScript(Id)]
    public sealed class AxeWeaponScript : IBattleScript
    {
        public const Int32 Id = 10000;

        private readonly BattleCalculator _v;
        private readonly CalcAttackBonus _bonus;

        public AxeWeaponScript(BattleCalculator v)
        {
            _v = v;
			_bonus = CalcAttackBonus.Dexterity;
        }

        public void Perform()
        {
            if (_v.Target.TryKillFrozen())
                return;

            _v.PhysicalAccuracy();
            if (!_v.TryPhysicalHit())
                return;

            _v.WeaponPhysicalParams(_bonus);
            _v.Caster.PhysicalPenaltyAndBonusAttack();
            _v.Target.PhysicalPenaltyAndBonusAttack();
            if (_v.Caster.IsUnderAnyStatus(BattleStatus.Trance) && _v.Caster.PlayerIndex == CharacterId.Steiner)
                _v.Context.Attack *= 2;

            _v.BonusBackstabAndPenaltyLongDistance();
            _v.Caster.BonusWeaponElement();
			
			Int32 huntCounter = Hunt.GetAttackCount(_v.Caster, _v.Target, true);
			Boolean huntTrance = huntCounter >= 0 && _v.Caster.InTrance;
			if (huntCounter >= 0)
				_v.Context.Attack = (_v.Context.Attack * Math.Min(5, 2 + huntCounter)) >> 1;
			
            if (_v.CanAttackWeaponElementalCommand())
            {
                _v.TryCriticalHit();
                _v.PenaltyReverseAttack();
                _v.CalcPhysicalHpDamage();
                _v.RaiseTrouble();
				if (huntCounter == 0)
					_v.Target.TryAlterStatuses(BattleStatus.Trouble, false);
				if (_v.Target.HpDamage >= _v.Target.CurrentHp)
					huntTrance = false;
            }
			
			if (huntTrance)
			{
				List<BattleAbilityId> greenMagics = new List<BattleAbilityId>();
				if (huntCounter >= 3)
				{
					if (_v.Caster.IsAbilityAvailable((BattleAbilityId)10005))
						greenMagics.Add((BattleAbilityId)10005);
				}
				if (greenMagics.Count == 0 && huntCounter >= 2)
				{
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Firaga))
						greenMagics.Add(BattleAbilityId.Firaga);
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Blizzaga))
						greenMagics.Add(BattleAbilityId.Blizzaga);
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Thundaga))
						greenMagics.Add(BattleAbilityId.Thundaga);
					if (_v.Caster.IsAbilityAvailable((BattleAbilityId)10004))
						greenMagics.Add((BattleAbilityId)10004);
					if (_v.Caster.IsAbilityAvailable((BattleAbilityId)10000))
						greenMagics.Add((BattleAbilityId)10000);
				}
				if (greenMagics.Count == 0 && huntCounter >= 1)
				{
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Fira))
						greenMagics.Add(BattleAbilityId.Fira);
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Blizzara))
						greenMagics.Add(BattleAbilityId.Blizzara);
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Thundara))
						greenMagics.Add(BattleAbilityId.Thundara);
					if (_v.Caster.IsAbilityAvailable((BattleAbilityId)10003))
						greenMagics.Add((BattleAbilityId)10003);
					if (_v.Caster.IsAbilityAvailable((BattleAbilityId)10001))
						greenMagics.Add((BattleAbilityId)10001);
				}
				if (greenMagics.Count == 0)
				{
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Fire))
						greenMagics.Add(BattleAbilityId.Fire);
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Blizzard))
						greenMagics.Add(BattleAbilityId.Blizzard);
					if (_v.Caster.IsAbilityAvailable(BattleAbilityId.Thunder))
						greenMagics.Add(BattleAbilityId.Thunder);
					if (_v.Caster.IsAbilityAvailable((BattleAbilityId)10002))
						greenMagics.Add((BattleAbilityId)10002);
				}
				if (greenMagics.Count > 0)
				{
					BattleAbilityId pickedMagic = greenMagics[Comn.random8() % greenMagics.Count];
					Boolean multiTarget = pickedMagic == (BattleAbilityId)10000 || pickedMagic == (BattleAbilityId)10001;
					BattleState.EnqueueCounter(_v.Caster, BattleCommandId.RushAttack, pickedMagic, multiTarget ? BattleState.GetUnitIdsUnderStatus(_v.Caster.IsPlayer, 0) : _v.Target.Id);
				}
			}
        }
    }
}