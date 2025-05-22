using System;
using System.Collections.Generic;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    [BattleScript(Id)]
    public sealed class DragonTransform : IBattleScript
    {
        public const Int32 Id = 10002;

        private readonly BattleCalculator _v;
		
		private enum DragonType
		{
			Dragonfly,
			Serpion,
			Ironite,
			Dracozombie,
			Hydra,
			Red,
			Shell,
			Grand,
			Silver,
			Nova,
			Tiamat
		}
		
		private class ShapePossibility
		{
			public String BattleName;
			public Int32 TypeIndex;
			public Single ScaleFactor;
			
			public ShapePossibility(String name, Int32 index, Single scale = 1.0f)
			{
				BattleName = name;
				TypeIndex = index;
				ScaleFactor = scale;
			}
		}
		
		private Dictionary<DragonType, ShapePossibility> Shapes = new Dictionary<DragonType, ShapePossibility>
		{
			{ DragonType.Dragonfly,		new ShapePossibility( "GT_R008", 0, 0.9f ) },
			{ DragonType.Serpion,		new ShapePossibility( "WM_0202", 0, 0.8f ) },
			{ DragonType.Ironite,		new ShapePossibility( "BU_R008", 0, 0.75f ) },
			{ DragonType.Dracozombie,	new ShapePossibility( "IF_R004", 0, 0.5f ) },
			{ DragonType.Hydra,			new ShapePossibility( "GV_R005", 0, 0.6f ) },
			{ DragonType.Red,			new ShapePossibility( "GV_E089A", 0, 0.5f ) },
			{ DragonType.Shell,			new ShapePossibility( "PD_R014", 0, 0.28f ) },
			{ DragonType.Grand,			new ShapePossibility( "WM_1000", 0, 0.5f ) },
			{ DragonType.Silver,		new ShapePossibility( "PD_E055", 0, 0.5f ) },
			{ DragonType.Nova,			new ShapePossibility( "CW_E060", 0, 0.4f ) },
			{ DragonType.Tiamat,		new ShapePossibility( "CW_E064", 0, 0.5f ) }
		};

        public DragonTransform(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			if (_v.Target.IsMonsterTransform || _v.Target.IsUnderAnyStatus(BattleStatus.Death))
			{
				_v.Context.Flags |= BattleCalcFlags.Miss;
				return;
			}
			
			Boolean isInTrance = _v.Target.InTrance;
			DragonType dragon = DragonType.Dragonfly;
			switch (_v.Caster.Weapon)
			{
				case RegularItem.Javelin:
					dragon = DragonType.Dragonfly;
					break;
				case RegularItem.MythrilSpear:
					dragon = DragonType.Serpion;
					break;
				case RegularItem.Partisan:
					dragon = DragonType.Ironite;
					break;
				case (RegularItem)10007:
					dragon = DragonType.Dracozombie;
					break;
				case RegularItem.IceLance:
					dragon = DragonType.Hydra;
					break;
				case RegularItem.Trident:
					dragon = DragonType.Red;
					break;
				case RegularItem.HeavyLance:
					dragon = DragonType.Shell;
					break;
				case RegularItem.Obelisk:
					dragon = DragonType.Grand;
					break;
				case RegularItem.HolyLance:
					dragon = DragonType.Silver;
					break;
				case RegularItem.KainLance:
					dragon = DragonType.Nova;
					break;
				case RegularItem.DragonHair:
					dragon = DragonType.Tiamat;
					break;
			}
			if (isInTrance)
				_v.Target.Trance = 0;
			
			Single factorBase = (99f - _v.Target.Level) / 99f;
			Single factorNew = _v.Target.Level / 99f;
			Single strBase = _v.Target.Strength;
			Single mgcBase = _v.Target.Magic;
			Single spdBase = _v.Target.Dexterity;
			Single sprBase = _v.Target.Will;
			Single defBase = _v.Target.PhysicalDefence;
			Single evaBase = _v.Target.PhysicalEvade;
			Single mdefBase = _v.Target.MagicDefence;
			Single mevaBase = _v.Target.MagicEvade;
			Single hpBase = _v.Target.MaximumHp;
			Single mpBase = _v.Target.MaximumMp;
			UInt32 hpCur = _v.Target.CurrentHp;
			UInt32 mpCur = _v.Target.CurrentMp;
			Single hpFactor = hpCur / hpBase;
			Single mpFactor = mpCur / mpBase;
			
			List<BattleCommandId> disable = new List<BattleCommandId>();
			disable.Add(BattleCommandId.Defend);
			disable.Add(BattleCommandId.Item);
			disable.Add(BattleCommandId.AccessMenu);
			_v.Target.ChangeToMonster(Shapes[dragon].BattleName, Shapes[dragon].TypeIndex, _v.Command.Id, (BattleCommandId)10006, !isInTrance, isInTrance, true, true, true, disable);
			if (dragon == DragonType.Ironite)
				_v.Target.ChangePositionCoordinate(75, 1, true, true, true, true);
			else if (dragon == DragonType.Silver)
				_v.Target.ChangePositionCoordinate(200, 1, true, true, true, true);
			_v.Target.ScaleModel((Int32)Math.Round(4096 * Shapes[dragon].ScaleFactor), true);
			
			Single strNew = factorBase * strBase + factorNew * _v.Target.Strength;
			Single mgcNew = factorBase * mgcBase + factorNew * _v.Target.Magic;
			Single spdNew = factorBase * spdBase + factorNew * _v.Target.Dexterity;
			Single sprNew = factorBase * sprBase + factorNew * _v.Target.Will;
			Single defNew = factorBase * defBase + factorNew * _v.Target.PhysicalDefence;
			Single evaNew = factorBase * evaBase + factorNew * _v.Target.PhysicalEvade;
			Single mdefNew = factorBase * mdefBase + factorNew * _v.Target.MagicDefence;
			Single mevaNew = factorBase * mevaBase + factorNew * _v.Target.MagicEvade;
			Single hpNew = factorBase * hpBase + factorNew * _v.Target.MaximumHp;
			Single mpNew = factorBase * mpBase + factorNew * _v.Target.MaximumMp;
			_v.Target.Strength = (Byte)Math.Round(Math.Max(strBase, strNew));
			_v.Target.Magic = (Byte)Math.Round(Math.Max(mgcBase, mgcNew));
			_v.Target.Dexterity = (Byte)Math.Round(Math.Max(spdBase, spdNew));
			_v.Target.Will = (Byte)Math.Round(Math.Max(sprBase, sprNew));
			_v.Target.PhysicalDefence = (Byte)Math.Round(Math.Max(defBase, defNew));
			_v.Target.PhysicalEvade = (Byte)Math.Round(Math.Max(evaBase, evaNew));
			_v.Target.MagicDefence = (Byte)Math.Round(Math.Max(mdefBase, mdefNew));
			_v.Target.MagicEvade = (Byte)Math.Round(Math.Max(mevaBase, mevaNew));
			_v.Target.MaximumHp = (UInt32)Math.Round(Math.Max(hpBase, hpNew));
			_v.Target.MaximumMp = (UInt32)Math.Round(Math.Max(mpBase, mpNew));
			if (isInTrance)
			{
				_v.Target.CurrentHp = (UInt32)Math.Min(_v.Target.MaximumHp, Math.Max(hpFactor * _v.Target.MaximumHp, hpCur));
				_v.Target.CurrentMp = (UInt32)Math.Min(_v.Target.MaximumMp, Math.Max(mpFactor * _v.Target.MaximumMp, mpCur));
			}
			else
			{
				_v.Target.CurrentHp = (UInt32)Math.Min(_v.Target.MaximumHp, Math.Max(_v.Target.CurrentHp, hpCur));
				_v.Target.CurrentMp = (UInt32)Math.Min(_v.Target.MaximumMp, Math.Max(_v.Target.CurrentMp, mpCur));
			}
        }
    }
}
